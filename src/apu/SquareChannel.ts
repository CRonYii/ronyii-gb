import { Register8 } from "../cpu/Register";
import LengthCounter from "./LengthCounter";
import SoundUnit from "./SoundUnit";

export default class SquareChannel extends SoundUnit {

    private readonly audioCtx: AudioContext;
    private readonly useSweep: boolean;

    public readonly lengthCounter: LengthCounter = new LengthCounter(this, 1 << 6);

    private readonly sweepRegister: Register8 = new Register8(); // 0xff10 - NR10
    private readonly wavePattern: Register8 = new Register8(); // 0xff11 - NR11 / 0xff16 - NR21
    private readonly volumeEnvelope: Register8 = new Register8(); // 0xff12 - NR12 / 0xff17 - NR22
    private readonly frequencyLow: Register8 = new Register8(); // 0xff13 - NR13 / 0xff18 - NR23
    private readonly frequencyHigh: Register8 = new Register8(); // 0xff14 - NR14 / 0xff19 - NR24

    constructor(audioCtx: AudioContext, useSweep: boolean) {
        super();
        this.audioCtx = audioCtx;
        this.useSweep = useSweep;
    }

    setByte(address: number, data: number) {
        switch (address) {
            case 0x0: return this.sweepRegister.set(data);
            case 0x1:
                this.wavePattern.set(data & 0xc0);
                this.lengthCounter.reload(data & 0x3f);
                return;
            case 0x2: return this.volumeEnvelope.set(data);
            case 0x3: return this.frequencyLow.set(data);
            case 0x4:
                this.frequencyHigh.set(data & 0b111);
                this.setTriggerAndLengthCounter(data);
                return;
        }
    }

    getByte(address: number): number {
        switch (address) {
            case 0x0: return this.useSweep ? this.sweepRegister.get() | 0x80 : 0xff;
            case 0x1: return this.wavePattern.get() | 0x3f;
            case 0x2: return this.volumeEnvelope.get();
            case 0x3: return 0xff;
            case 0x4: return (this.isLengthCounterEnable() ? 0x40 : 0) | 0xbf;
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

    size() {
        return 5;
    }

}