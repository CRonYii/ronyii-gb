import { Register8 } from "../cpu/Register";
import LengthCounter from "./LengthCounter";
import SoundUnit from "./SoundUnit";

export default class NoiseChannel extends SoundUnit {

    private readonly audioCtx: AudioContext;

    public readonly lengthCounter: LengthCounter = new LengthCounter(this, 1 << 6); // 0xff20 - NR41
    private readonly volumeEnvelope: Register8 = new Register8(); // 0xff21 - NR42
    private readonly polynomialCounter: Register8 = new Register8(); // 0xff22 - NR43

    constructor(audioCtx: AudioContext) {
        super("Noise Channel");
        this.audioCtx = audioCtx;
    }

    setByte(address: number, data: number) {
        switch (address) {
            case 0xff20: return this.lengthCounter.reload(data & 0x3f);
            case 0xff21:
                this.volumeEnvelope.set(data);
                this.setPower((data & 0xf8) !== 0);
                return;
            case 0xff22: return this.polynomialCounter.set(data);
            case 0xff23:
                this.setTriggerAndLengthCounter(data);
                return;
        }
    }

    getByte(address: number): number {
        switch (address) {
            case 0xff20: return 0xff;
            case 0xff21: return this.volumeEnvelope.get();
            case 0xff22: return this.polynomialCounter.get();
            case 0xff23: return (this.isLengthCounterEnable() ? 0x40 : 0) | 0xbf;
        }
        throw new Error('Unsupported SquareChannel register');
    }

    powerOff() {
        this.setByte(0xff20, 0);
        this.setByte(0xff21, 0);
        this.setByte(0xff22, 0);
        this.setByte(0xff23, 0);
    }

    size() {
        return 4;
    }

}