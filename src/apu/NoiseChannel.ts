import { Register8 } from "../cpu/Register";
import LengthCounter from "./LengthCounter";
import SoundUnit from "./SoundUnit";
import VolumeEnvelope from "./VolumeEnvelope";

export default class NoiseChannel extends SoundUnit {

    public readonly lengthCounter: LengthCounter = new LengthCounter(this, 1 << 6); // 0xff20 - NR41
    public readonly volumeEnvelope: VolumeEnvelope = new VolumeEnvelope(); // 0xff21 - NR42
    private readonly polynomialCounter: Register8 = new Register8(); // 0xff22 - NR43

    constructor(audioCtx: AudioContext) {
        super("Noise Channel", audioCtx);
    }

    sample() {
        // TODO
        return 0;
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
        throw new Error('Unsupported NoiseChannel register');
    }

    public reload() {
        super.reload();
        this.volumeEnvelope.reload();
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