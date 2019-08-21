import { Memory } from "./Memory";
import { Register8 } from "../cpu/Register";
import Clock from "../cpu/Clock";
import { CPU_CLOCK_SPEED } from "../constants/index";
import { InterruptFlagsEKey } from "./IORegisters";
import FlagManager from "../utils/FlagManager";
import Helper from "../utils/Helper";

export class Timer implements Memory {

    static DIV_INCREMENT_FREQ: number = CPU_CLOCK_SPEED / 16_384; // the cycles taken to increment DIV once

    private readonly DIV = new Register8(); // FF04
    private readonly TIMA = new Register8(); // FF05
    private readonly TMA = new Register8(); // FF06
    private readonly TAC = new Register8(); // FF07

    private readonly interruptManager: FlagManager<InterruptFlagsEKey>;

    private timaFreq: number = CPU_CLOCK_SPEED / 4_096;

    private divCycles: number = 0;
    private timaCycles: number = 0;

    constructor(clock: Clock, interruptManager: FlagManager<InterruptFlagsEKey>) {
        this.interruptManager = interruptManager;
        clock.add(this.next.bind(this));
    }

    next(cycles: number): number {
        // incrementing div
        this.divCycles += cycles;
        if (this.divCycles >= Timer.DIV_INCREMENT_FREQ) {
            this.DIV.inc();
            this.divCycles -= Timer.DIV_INCREMENT_FREQ;
        }
        // increment tima
        if ((this.TAC.get() & 0b100) !== 0) {
            this.timaCycles += cycles;
            while (this.timaCycles >= this.timaFreq) {
                if (this.TIMA.inc()) {
                    this.TIMA.set(this.TMA.get());
                    this.interruptManager.set('Timer', true);
                }
                this.timaCycles -= this.timaFreq;
            }
        }
        return 0;
    }

    setByte(address: number, data: number): void {
        switch (address) {
            case 0xff04: return this.DIV.set(0);
            case 0xff05: return this.TIMA.set(data);
            case 0xff06: return this.TMA.set(data);
            case 0xff07:
                switch (data & 0b11) {
                    case 0b00: this.timaFreq = CPU_CLOCK_SPEED / 4_096; break;
                    case 0b01: this.timaFreq = CPU_CLOCK_SPEED / 262_144; break;
                    case 0b10: this.timaFreq = CPU_CLOCK_SPEED / 65_536; break;
                    case 0b11: this.timaFreq = CPU_CLOCK_SPEED / 16_384; break;
                }
                return this.TAC.set(data);
            default: throw new Error('Invalid Timer register address');
        }
    }

    getByte(address: number): number {
        switch (address) {
            case 0xff04: return this.DIV.get();
            case 0xff05: return this.TIMA.get();
            case 0xff06: return this.TMA.get();
            case 0xff07: return this.TAC.get();
            default: throw new Error('Invalid Timer register address');
        }
    }

    size(): number {
        return 4;
    }

}