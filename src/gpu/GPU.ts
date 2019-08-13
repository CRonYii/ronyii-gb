import Clock from "../cpu/Clock";
import MMU from "../memory/MMU";
import MemoryManager from "../utils/MemoryManager";
import { Display } from "./Display";
import { IORegisterControls, IORegisterControlsKeys } from "../memory/IORegisters";

export interface GPUConfigs {
    clock: Clock,
    mmu: MMU,
    display: Display
}

export default class GPU {

    private readonly mem: MemoryManager<IORegisterControlsKeys>;
    private readonly display: Display;
    private clockCycles: number = 0;
    private currentLine: number = 0;

    constructor(configs: GPUConfigs) {
        this.mem = new MemoryManager(configs.mmu, IORegisterControls);
        this.display = configs.display;
        configs.clock.add((clockCycles) => {
            this.clockCycles += clockCycles;
            return this.checkline();
        });
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

    private renderScan() {

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