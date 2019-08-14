import Clock from "../cpu/Clock";
import MMU from "../memory/MMU";
import MemoryManager from "../utils/MemoryManager";
import { Display } from "./Display";
import { IORegisterControls, IORegisterControlsKeys } from "../memory/IORegisters";
import { LCDCManager, LCDCFlagsKey, STATFlagsKey, STATManager } from "./GPUFlags";
import FlagManager from "../utils/FlagManager";
import Helper from "../utils/Helper";

export interface GPUConfigs {
    clock: Clock,
    mmu: MMU,
    display: Display
}

export default class GPU {

    private readonly mmu: MMU;
    private readonly mem: MemoryManager<IORegisterControlsKeys>;
    private readonly lcdc: FlagManager<LCDCFlagsKey>;
    private readonly stat: FlagManager<STATFlagsKey>;
    private readonly display: Display;
    private clockCycles: number = 0;

    constructor(configs: GPUConfigs) {
        const { mmu } = configs;
        this.mmu = mmu;
        this.mem = new MemoryManager(mmu, IORegisterControls);
        this.lcdc = LCDCManager({
            set: (flag: number) => mmu.setByte(0xff40, flag),
            get: () => mmu.getByte(0xff40)
        });
        this.stat = STATManager({
            set: (flag: number) => mmu.setByte(0xff41, flag),
            get: () => mmu.getByte(0xff41)
        });
        this.display = configs.display;
        configs.clock.add((clockCycles) => {
            this.clockCycles += clockCycles;
            return this.checkline();
        });
    }

    /**
     * Render one horizontal scanline
     */
    private renderScan() {
        this.renderBackground();
    }

    /**
     * render one line of background
     */
    private renderBackground() {
        // SCX/SCY indicates which pixel to start in the 256 * 256 pixels BG map
        // here we are accessing the pixel by finding the tile first
        const scx = this.mem.getByte('SCX');
        const tileIdx = (scx >> 3) & 31; // which tile in the line [0, 31] 5 bits
        const x = scx & 7; // where in the tileline to start [0, 7] 3 bits

        const scy = this.mem.getByte('SCY');
        const lineIdx = (((this.currentLine + scy) & 0xff) >> 3); // which line of tiles to use [0, 31] 5 bits
        const y = (this.currentLine + scy) & 7; // which line of pixels to use in that tile [0, 7] 3 bits

        const bgMapBaseAddr = this.getBGTileAddress(lineIdx, tileIdx);

        this.renderBGScan(this.currentLine, bgMapBaseAddr, x, y);
    }

    /**
     * 
     * @param tilePtrBaseAddr the absolute memory address of the first background tile reference (top-left corner)
     * @param x the x pixel offset
     * @param y the y pixel offset
     */
    private renderBGScan(line: number, tilePtrBaseAddr: number, x: number, y: number) {
        // start with the top-left corner of the 160 * 144 pixels to be drawn
        for (let i = 0; i < 20; i++) {
            const tileIdx = this.mmu.getByte(tilePtrBaseAddr + i);
            const tileline = this.getTileline(this.getTileAddress(tileIdx) + (y * 2));
            for (let j = 0; j < tileline.length; j++) {
                const color = this.getColor(tileline[x]); // one of the four color
                this.display.setPixel((i * 8) + j, line, color);
                x = (x + 1) & 7;
            }
        }
    }

    /**
     * Returns the absolute address in the BG map
     * @param tileIdx [0, 31]
     * @param lineIdx [0, 31]
     */
    public getBGTileAddress(lineIdx: number, tileIdx: number) {
        lineIdx &= 31;
        tileIdx &= 31;
        const mapbaseFlag = this.lcdc.get('bg_map_base');
        let mapbase = mapbaseFlag ? 0x9c00 : 0x9800; // the tile map to be used based on LCDC flag (0x9800 / 0x9c00)

        /**
         * First 6 bits sets the base address,
         * the following 5 bits ranges [0, 31] is the line number wher the tile is at,
         * the last 5 bits ranges [0, 31] is the index of the tile in the line 
         * in other word, the last 10 bits selects one out of 2^10 (1024)
         * [mapbase, lineIdx, tileIdx]
         */
        mapbase += (lineIdx << 5) + tileIdx;

        return mapbase;
    }

    public getTileAddress(tileIdx: number) {
        let address = (tileIdx & 0xff);
        if (this.lcdc.get('bg_tile_base')) { // (0x8000 ~ 0x8fff) unsigned size: 2^12 (4096)
            address <<= 4;
            address += 0x8000;
        } else { // (0x8800 ~ 0x97ff) signed
            address = Helper.toSigned8(address) + 128;
            address <<= 4;
            address += 0x8800
        }

        return address;
    }

    public getTile(tilePtr: number, x = 0, y = 0) {
        const tile = new Array<number>(64);
        for (let i = 0; i < 8; i++) {
            const tileline = this.getTileline(tilePtr + y + (i * 2), x);
            for (let j = 0; j < tileline.length; j++) {
                tile[j + i * 8] = this.getColor(tileline[j]); // one of the four color
            }
        }
        return tile;
    }

    // precondition: address % 2 === 0
    public getTileline(tilelinePtr: number, offset = 0) {
        const byte1 = this.mmu.getByte(tilelinePtr);
        const byte2 = this.mmu.getByte(tilelinePtr + 1);
        const tiles = new Array<number>(8);

        for (let i = 0; i < 8; i++) {
            const index = (1 << (7 - i));

            tiles[(i + offset) & 7] =
                ((byte1 & index) ? 1 : 0) +
                ((byte2 & index) ? 2 : 0);
        }

        return tiles;
    }

    static PALETTE = [0xff000000, 0xff606060, 0xffc0c0c0, 0xffffffff];

    public getColor(code: number) {
        const palette = this.mem.getByte('BGP');
        return [
            GPU.PALETTE[(palette >> 6) & 0b11],
            GPU.PALETTE[(palette >> 4) & 0b11],
            GPU.PALETTE[(palette >> 2) & 0b11],
            GPU.PALETTE[(palette) & 0b11],
        ][code];
    }

    /**
     *                  (start ==>)
     *  after 144  ┌── read OAM ===> read VRAM ===> H-Blank ─┐
     *  times of   │   ↑  Repeat for 144 times (144 lines)   │
     *  H-Blank    │   └─────────────────────────────────────┘
     *             └──────→ V-Blank ===> goes back to (start)
     */
    private checkline(): number {
        switch (this.linemode) {
            case 2:
                this.checklineOAMMode();
                break;
            case 3:
                this.checklineVRAMMode();
                break;
            case 0:
                this.checklineHBlank();
                break;
            case 1:
                this.checklineVBlank();
                break;
        }
        return 0;
    }

    private checklineHBlank() {
        // H-Blank (mode 00) takes 204 clock cyles to finish
        if (this.clockCycles < 204) {
            return;
        }

        if (this.currentLine === 143) { // done scanning for the 144 lines
            this.linemode = 1; // goes into VBlank (goes back to top-left corner)
            if (this.stat.get('mode01_interrupt')) {
                this.mmu.interruptFlagsManager.set('LCDC', true);
            }
            this.display.requestRefresh();
            this.mmu.interruptFlagsManager.set('VBlank', true);
        } else {
            this.linemode = 2;
        }

        this.clockCycles = 0;
        this.currentLine++;
    }

    private checklineVBlank() {
        if (this.clockCycles < 456) {
            return;
        }

        this.clockCycles = 0;
        this.currentLine++;

        // V-Blank takes 10 lines (10 plus the 143 previous H-Blank)
        if (this.currentLine > 153) {
            this.linemode = 2;
            if (this.stat.get('mode10_interrupt')) {
                this.mmu.interruptFlagsManager.set('LCDC', true);
            }
            this.currentLine = 0;
        }
    }

    private checklineOAMMode() {
        if (this.clockCycles < 80) {
            return;
        }

        this.clockCycles = 0;
        this.linemode = 3;
    }

    private checklineVRAMMode() {
        if (this.clockCycles < 172) {
            return;
        }

        this.clockCycles = 0;
        this.linemode = 0;

        if (this.stat.get('mode00_interrupt')) {
            this.mmu.interruptFlagsManager.set('LCDC', true);
        }

        this.renderScan(); // write one line to display buffer
    }

    set currentLine(value: number) {
        value &= 0xff;
        this.mem.setByte('LY', value);
        // Compare LYC and LY and set the STAT coincidence flag bit 6
        const LYCflag = this.mem.getByte('LYC') === value;
        this.stat.set('coincidence', LYCflag);

        if (this.stat.get('coincidence_interrupt') && LYCflag === true) {
            this.mmu.interruptFlagsManager.set('LCDC', true);
        }
    }

    get currentLine() {
        return this.mem.getByte('LY');
    }

    set linemode(mode: number) {
        const value = (this.mem.getByte('STAT') & 0b00) | mode;
        this.mem.setByte('STAT', value);
    }

    get linemode() {
        return this.mem.getByte('STAT') & 0b11;
    }

}