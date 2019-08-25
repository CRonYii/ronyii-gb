import { Register8 } from "../cpu/Register";
import { SoundUnit } from "./APU";
import LengthCounter from "./LengthCounter";

export default class SquareChannel implements SoundUnit {

    private readonly audioCtx: AudioContext;
    private readonly useSweep: boolean;

    public readonly lengthCounter: LengthCounter = new LengthCounter(this);

    private trigger: boolean = false;

    private readonly sweepRegister: Register8 = new Register8(); // 0xff10 - NR10
    private readonly soundLengthWavePattern: Register8 = new Register8(); // 0xff11 - NR11 / 0xff16 - NR21
    private readonly volumeEnvelope: Register8 = new Register8(); // 0xff12 - NR12 / 0xff17 - NR22
    private readonly frequencyLow: Register8 = new Register8(); // 0xff13 - NR13 / 0xff18 - NR23
    private readonly frequencyHigh: Register8 = new Register8(); // 0xff14 - NR14 / 0xff19 - NR24

    constructor(audioCtx: AudioContext, useSweep: boolean) {
        this.audioCtx = audioCtx;
        this.useSweep = useSweep;
    }

    setByte(address: number, data: number) {
        switch (address) {
            case 0x0: return this.sweepRegister.set(data);
            case 0x1:
                this.soundLengthWavePattern.set(data);
                this.lengthCounter.reload((1 << 6) - (data & 0x3f));
                return;
            case 0x2: return this.volumeEnvelope.set(data);
            case 0x3: return this.frequencyLow.set(data);
            case 0x4:
                this.frequencyHigh.set(data);
                this.trigger = (data & 0x80) !== 0;
                if (this.isOn()) {
                    if (this.lengthCounter.counter === 0 || !this.isLengthCounterEnable()) {
                        this.lengthCounter.reload(1 << 6);
                    }
                }
                return;
        }
    }

    getByte(address: number): number {
        switch (address) {
            case 0x0: return this.useSweep ? this.sweepRegister.get() | 0x80 : 0xff;
            case 0x1: return this.soundLengthWavePattern.get() | 0x3f;
            case 0x2: return this.volumeEnvelope.get();
            case 0x3: return 0xff;
            case 0x4: return this.frequencyHigh.get() | 0xbf;
        }
        throw new Error('Unsupported SquareChannel register');
    }

    powerOff() {
        this.setByte(0x0, 0);
        this.setByte(0x1, 0);
        this.setByte(0x2, 0);
        this.setByte(0x3, 0);
        this.setByte(0x4, 0);
    }

    setTrigger(trigger: boolean): void {
        this.trigger = trigger;
    }

    isOn(): boolean {
        return this.trigger;
    }

    isLengthCounterEnable(): boolean {
        return (this.frequencyHigh.get() & 0x40) !== 0;
    }

    size() {
        return 5;
    }

}