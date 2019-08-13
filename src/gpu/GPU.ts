import Clock from "../cpu/Clock";
import MMU from "../memory/MMU";
import MemoryManager from "../utils/MemoryManager";
import { Display } from "./Display";
import { IORegisterControls, IORegisterControlsKeys } from "../memory/IORegisters";
import { LCDCManager, LCDCFlagsKey } from "./GPUFlags";
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
    private readonly display: Display;
    private clockCycles: number = 0;
    private currentLine: number = 0;

    constructor(configs: GPUConfigs) {
        const { mmu } = configs;
        this.mmu = mmu;
        this.mem = new MemoryManager(mmu, IORegisterControls);
        this.lcdc = LCDCManager({
            set: (flag: number) => mmu.setByte(0xff40, flag),
            get: () => mmu.getByte(0xff40)
        });
        this.display = configs.display;
        configs.clock.add((clockCycles) => {
            this.clockCycles += clockCycles;
            return this.checkline();
        });
    }

    /**
     * render one line of background
     */
    private renderScan() {
        const mapbaseFlag = this.lcdc.get('bg_map_base');
        let mapbase = mapbaseFlag ? 0x9c00 : 0x9800; // the tile map to be used based on LCDC flag (0x9800 / 0x9c00)

        const scx = this.mem.getByte('SCX');
        const tileIdx = (scx >> 3) & 31; // which tile in the line [0, 31] 5 bits
        let x = scx & 7; // where in the tileline to start [0, 7] 3 bits

        const scy = this.mem.getByte('SCY');
        const lineIdx = (((this.currentLine + scy) & 0xff) >> 3); // which line of tiles to use [0, 31] 5 bits
        const y = (this.currentLine + scy) & 7; // which line of pixels to use in that tile [0, 7] 3 bits

        /**
         * First 6 bits sets the base address,
         * the following 5 bits ranges [0, 31] is the line number wher the tile is at,
         * the last 5 bits ranges [0, 31] is the index of the tile in the line 
         * in other word, the last 10 bits selects one out of 2^10 (1024)
         * [mapbase, lineIdx, tileIdx]
         */
        mapbase += (lineIdx << 5); // line number is bit 5 ~ 9

        // start with the top-left corner of the 160 * 144 pixels to be drawn
        for (let i = 0; i < 20; i++) {
            const tilePtr = this.mmu.getByte(mapbase + tileIdx + i);
            const tileline = this.getTileline(tilePtr + y);
            for (let j = 0; j < tileline.length; j++) {
                // this.display.setPixel();
                const color = this.getColor(tileline[x]); // one of the four color
                this.display.setPixel((i * 8) + j, this.currentLine, color);
                x = (x + 1) & 8;
            }
        }
    }

    // precondition: address % 2 === 0
    private getTileline(address: number) {
        address &= 0xff;
        if (this.lcdc.get('bg_tile_base')) { // (0x8000 ~ 0x8fff) unsigned size: 2^12 (4096)
            address += 0x8000;
        } else { // (0x8800 ~ 0x97ff) signed
            address = Helper.toSigned8(address) + 128 + 0x8800;
        }

        const byte1 = this.mmu.getByte(address);
        const byte2 = this.mmu.getByte(address + 1);
        const tiles = new Array<number>(8);

        for (let i = 0; i < 8; i++) {
            const index = 1 << i;

            tiles[7 - i] =
                ((byte1 & index) ? 1 : 0) +
                ((byte2 & index) ? 2 : 0);
        }

        return tiles;
    }

    private getColor(code: number) {
        // TODO: fetch real color from palettes
        return [0x222222ff, 0x666666ff, 0xaaaaaaff, 0xffffffff][code];
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
            this.display.requestRefresh(); // TODO: VBlank interrupt

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

        // V-Blank takes 10 lines (10 plus the 143 previous H-Blank)
        if (this.currentLine > 153) {
            this.linemode = 2;
            this.currentLine = 0;
        }

        // TODO: inc LY, cp LYC set STAT bit 6
        this.clockCycles = 0;
        this.currentLine++;
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

        this.renderScan(); // write one line to display buffer
    }

    set linemode(mode: number) {
        const value = this.mem.getByte('STAT') & 0b00 | mode;
        this.mem.setByte('STAT', value);
    }

    get linemode() {
        return this.mem.getByte('STAT') & 0b11;
    }

    // TODO: 0xFF41 (STAT) bits 6~3
    // get interruptSelection() {
    //     const STAT = this.STAT;
    //     if (ALU.bitSet(STAT, 5)) {
    //         return 0b10;
    //     } else if (ALU.bitSet(STAT, 4)) {
    //         return 0b01;
    //     } else if (ALU.bitSet(STAT, 3)) {
    //         return 0b00;
    //     }
    // }

}