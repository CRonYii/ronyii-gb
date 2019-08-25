import { Register8 } from "../cpu/Register";
import { SoundUnit } from "./APU";

export default class SquareChannel implements SoundUnit {

    private readonly audioCtx: AudioContext;

    private trigger: boolean = false;

    private readonly soundLengthWavePattern: Register8 = new Register8(); // 0xff11 - NR11 / 0xff16 - NR21
    private readonly volumeEnvelope: Register8 = new Register8(); // 0xff12 - NR12 / 0xff17 - NR22
    private readonly frequencyLow: Register8 = new Register8(); // 0xff13 - NR13 / 0xff18 - NR23
    private readonly frequencyHigh: Register8 = new Register8(); // 0xff14 - NR14 / 0xff19 - NR24

    constructor(audioCtx: AudioContext) {
        this.audioCtx = audioCtx;
    }

    setByte(address: number, data: number) {
        switch (address) {
            case 0x0: return this.soundLengthWavePattern.set(data);
            case 0x1: return this.volumeEnvelope.set(data);
            case 0x2: return this.frequencyLow.set(data);
            case 0x3:
                this.frequencyHigh.set(data);
                this.trigger = (data & 0x80) !== 0;
                return;
        }
    }

    getByte(address: number): number {
        switch (address) {
            case 0x0: return this.soundLengthWavePattern.get() | 0x3f;
            case 0x1: return this.volumeEnvelope.get();
            case 0x2: return 0xff;
            case 0x3: return this.frequencyHigh.get() | 0xbf;
        }
        throw new Error('Unsupported SquareChannel register');
    }

    powerOff() {
        this.soundLengthWavePattern.set(0);
        this.volumeEnvelope.set(0);
        this.frequencyLow.set(0);
        this.frequencyHigh.set(0);
    }

    isOn(): boolean {
        return this.trigger;
    }

    size() {
        return 4;
    }

}