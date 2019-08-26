import Timer from "../utils/Timer";
import SquareChannel from "./SquareChannel";
import ALU from "../cpu/ALU";

export default class Sweep {

    private readonly soundUnit: SquareChannel;
    private readonly timer: Timer = new Timer(8);

    private frequency: number = 0;
    private shadow: number = 0;
    private power: boolean = false;

    private period: number = 0; // bit 6-4
    private mode: number = 0; // bit 3
    private shift: number = 0; // bit 2-0

    constructor(soundUint: SquareChannel) {
        this.soundUnit = soundUint;
    }

    tick() {
        if (!this.power) {
            return;
        }
        if (this.timer.tick(1) === 0) {
            return;
        }

        this.calculateFrequency();
        if (this.frequency < 2048 && this.shift !== 0 && this.period !== 0) {
            this.soundUnit.setFrequency(this.frequency);
            this.shadow = this.frequency;
            this.calculateFrequency();
        }
    }

    /**
     * Frequency calculation consists of taking the value in the frequency shadow register,
     * shifting it right by sweep shift,
     * optionally negating the value,
     * and summing this with the frequency shadow register to produce a new frequency.
     */
    calculateFrequency() {
        const offset = this.shadow >> this.shift;
        if (this.mode === 1) { // subtraction
            this.frequency = ALU.sub16(this.shadow, offset).result;
        } else if (this.mode === 0) { // addition
            this.frequency = ALU.add16(this.shadow, offset).result;
        }
        // overflow check
        if (this.frequency > 2047) {
            this.soundUnit.setTrigger(false);
        }
    }

    /**
     * During a trigger event, several things occur:
     * 1. Square 1's frequency is copied to the shadow register.
     * 2. The sweep timer is reloaded.
     * 3. The internal enabled flag is set if either the sweep period or shift are non-zero, cleared otherwise.
     * 4. If the sweep shift is non-zero, frequency calculation and the overflow check are performed immediately.
     */
    reload() {
        this.shadow = this.soundUnit.getFrequency();
        // timer treats 0 as 8
        this.timer.period = this.period !== 0 ? this.period : 8;
        this.power = (this.period !== 0) || (this.shift !== 0);

        if (this.shift !== 0) {
            this.calculateFrequency();
        }
    }

    set(data: number) {
        this.period = (data & 0x70) >> 4;
        this.mode = (data & 0x8) >> 3;
        this.shift = (data & 0b111);
    }

    get(): number {
        return (this.period << 4) | (this.mode << 3) | this.shift;
    }

}