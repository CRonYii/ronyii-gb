import { SCREEN_RESOLUTION } from "../constants/index";
import Clock from "../cpu/Clock";
import { Register8 } from "../cpu/Register";
import { InterruptFlagsEKey } from "../memory/IORegisters";
import { Memory, MemorySegment } from "../memory/Memory";
import FlagManager from "../utils/FlagManager";
import Helper from "../utils/Helper";
import { Display } from "./Display";
import { LCDCFlagsKey, LCDCManager, STATFlagsKey, STATManager } from "./GPUFlags";

export interface GPUConfigs {
    clock: Clock,
    display: Display,
    interruptFlagsManager: FlagManager<InterruptFlagsEKey>
}

export default class GPU implements Memory {

    private readonly VRAM: Memory = new MemorySegment({ size: 0x2000, offset: 0x8000, readable: true, writable: true }); // 8kB Video RAM

    private readonly lcdc: FlagManager<LCDCFlagsKey>;
    private readonly stat: FlagManager<STATFlagsKey>;
    private readonly scy: Register8 = new Register8();
    private readonly scx: Register8 = new Register8();
    private readonly ly: Register8 = new Register8();
    private readonly lyc: Register8 = new Register8();
    private readonly bgp: Register8 = new Register8();
    private readonly obp0: Register8 = new Register8();
    private readonly obp1: Register8 = new Register8();
    private readonly wy: Register8 = new Register8();
    private readonly wx: Register8 = new Register8();

    private readonly interruptFlagsManager: FlagManager<InterruptFlagsEKey>;
    private readonly display: Display;
    private dots: number = 0;

    constructor(configs: GPUConfigs) {
        const { display, clock, interruptFlagsManager } = configs;
        this.display = display;
        this.interruptFlagsManager = interruptFlagsManager;
        this.lcdc = LCDCManager();
        this.stat = STATManager();
        clock.add(this.checkline.bind(this));
    }

    /**
     * Render one horizontal scanline
     */
    private renderScan() {
        if (this.lcdc.get('bg_on')) {
            this.renderBackground();
        }
        if (this.lcdc.get('obj_on')) {
            // TODO: render Sprites
        }
    }

    /**
     * render one line of background
     */
    private renderBackground() {
        // SCX/SCY indicates which pixel to start in the 256 * 256 pixels BG map
        // here we are accessing the pixel by finding the tile first
        const scy = this.scy.get();
        const lineIdx = (((this.currentLine + scy) & 0xff) >> 3); // which line of tiles to use [0, 31] 5 bits
        const y = (this.currentLine + scy) & 7; // which line of pixels to use in that tile [0, 7] 3 bits

        // start with the top-left corner of the 160 * 144 pixels to be drawn
        for (let i = 0; i < 160; i++) {
            const scx = this.scx.get() + i;
            const tileIdx = (scx >> 3) & 31; // which tile in the line [0, 31] 5 bits
            const x = scx & 7; // where in the tileline to start [0, 7] 3 bits

            const bgMapBaseAddr = this.getBGTileAddress(lineIdx, tileIdx);
            const tileNumber = this.getByte(bgMapBaseAddr);

            const pixel = this.getTilePixel(this.getTileAddress(tileNumber) + (y * 2), x);
            const color = this.getColor(pixel); // one of the four color
            this.display.setPixel(i, this.currentLine, color);
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
        const byte1 = this.getByte(tilelinePtr);
        const byte2 = this.getByte(tilelinePtr + 1);
        const tiles = new Array<number>(8);

        for (let i = 0; i < 8; i++) {
            const index = (1 << (7 - i));

            tiles[(i + offset) & 7] =
                ((byte1 & index) ? 1 : 0) +
                ((byte2 & index) ? 2 : 0);
        }

        return tiles;
    }

    public getTilePixel(tilelinePtr: number, offset: number) {
        const byte1 = this.getByte(tilelinePtr);
        const byte2 = this.getByte(tilelinePtr + 1);

        const index = 0x80 >> offset;
        return ((byte1 & index) ? 1 : 0) |
            ((byte2 & index) ? 2 : 0);
    }

    static WHITE = 0xffffffff;
    static LIGHT = 0xffc0c0c0;
    static DARK = 0xff606060;
    static BLACK = 0xff000000;

    public getColor(code: number) {
        const palette = this.bgp.get();
        switch (palette >> (2 * code) & 0b11) {
            case 0b00: return GPU.WHITE;
            case 0b01: return GPU.LIGHT;
            case 0b10: return GPU.DARK;
            case 0b11: return GPU.BLACK;
            default: throw new Error('Invalid color code');
        }
    }

    /**
     *                  (start ==>)
     *  after 144  ┌── read OAM ===> read VRAM ===> H-Blank ─┐
     *  times of   │   ↑  Repeat for 144 times (144 lines)   │
     *  H-Blank    │   └─────────────────────────────────────┘
     *             └──────→ V-Blank ===> goes back to (start)
     */
    private checkline(clockCycles: number): number {
        if (!this.lcdc.get('lcd_on')) {
            return 0;
        }
        this.dots += clockCycles;
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
        if (this.dots < 204) {
            return;
        }

        if (this.currentLine === 143) { // done scanning for the 144 lines
            this.linemode = 1; // goes into VBlank (goes back to top-left corner)
            this.interruptFlagsManager.set('VBlank', true);
            if (this.stat.get('mode01_interrupt')) {
                this.interruptFlagsManager.set('LCDC', true);
            }
            this.display.requestRefresh();
        } else {
            this.linemode = 2;
        }

        this.dots = 0;
        this.currentLine++;
    }

    private checklineVBlank() {
        if (this.dots < 456) {
            return;
        }

        this.dots = 0;
        this.currentLine++;

        // V-Blank takes 10 lines (10 plus the 143 previous H-Blank)
        if (this.currentLine >= 154) {
            this.linemode = 2;
            if (this.stat.get('mode10_interrupt')) {
                this.interruptFlagsManager.set('LCDC', true);
            }
            this.currentLine = 0;
        }
    }

    private checklineOAMMode() {
        if (this.dots < 80) {
            return;
        }

        this.dots = 0;
        this.linemode = 3;
    }

    private checklineVRAMMode() {
        if (this.dots < 172) {
            return;
        }

        this.dots = 0;
        this.linemode = 0;

        if (this.stat.get('mode00_interrupt')) {
            this.interruptFlagsManager.set('LCDC', true);
        }

        this.renderScan(); // write one line to display buffer
    }

    set currentLine(value: number) {
        value &= 0xff;
        this.ly.set(value);
        // Compare LYC and LY and set the STAT coincidence flag bit 6
        const LYCflag = this.lyc.get() === value;
        this.stat.set('coincidence', LYCflag);

        if (this.stat.get('coincidence_interrupt') && LYCflag === true) {
            this.interruptFlagsManager.set('LCDC', true);
        }
    }

    get currentLine() {
        return this.ly.get();
    }

    set linemode(mode: number) {
        const value = (this.stat.flag() & 0b00) | mode;
        this.stat.setValue(value);
    }

    get linemode() {
        return this.stat.flag() & 0b11;
    }

    setByte(address: number, data: number): void {
        if (address >= 0x8000 && address <= 0x9fff) {
            this.VRAM.setByte(address, data);
            return;
        }
        switch (address) {
            case 0xff40:
                this.lcdc.setValue(data);
                if (!this.lcdc.get('lcd_on')) {
                    this.dots = 0;
                    this.ly.set(0);
                    this.linemode = 0;
                    this.display.putImageData(new Array(SCREEN_RESOLUTION.WIDTH * SCREEN_RESOLUTION.HEIGHT).fill(GPU.WHITE));
                    this.display.requestRefresh();
                }
                break;
            case 0xff41: return this.stat.setValue(data);
            case 0xff42: return this.scy.set(data);
            case 0xff43: return this.scx.set(data);
            case 0xff44: return this.ly.set(data);
            case 0xff45: return this.lyc.set(data);
            case 0xff47: return this.bgp.set(data);
            case 0xff48: return this.obp0.set(data);
            case 0xff49: return this.obp1.set(data);
            case 0xff4a: return this.wy.set(data);
            case 0xff4b: return this.wx.set(data);
        }
    }

    getByte(address: number): number {
        if (address >= 0x8000 && address <= 0x9fff) {
            return this.VRAM.getByte(address);
        }
        switch (address) {
            case 0xff40: return this.lcdc.flag();
            case 0xff41: return this.stat.flag();
            case 0xff42: return this.scy.get();
            case 0xff43: return this.scx.get();
            case 0xff44: return this.ly.get();
            case 0xff45: return this.lyc.get();
            case 0xff47: return this.bgp.get();
            case 0xff48: return this.obp0.get();
            case 0xff49: return this.obp1.get();
            case 0xff4a: return this.wy.get();
            case 0xff4b: return this.wx.get();
            default: throw new Error('Unsupported GPU memory address ' + address);
        }
    }

    size(): number {
        return 0x2000 + 2;
    }

}