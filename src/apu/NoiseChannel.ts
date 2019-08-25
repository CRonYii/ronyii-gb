import { Register8 } from "../cpu/Register";
import { SoundUnit } from "./APU";

export default class NoiseChannel implements SoundUnit {

    private readonly audioCtx: AudioContext;

    private trigger: boolean = false;

    private readonly soundLength: Register8 = new Register8(); // 0xff20 - NR41
    private readonly volumeEnvelope: Register8 = new Register8(); // 0xff21 - NR42
    private readonly polynomialCounter: Register8 = new Register8(); // 0xff22 - NR43
    private readonly selectionRegister: Register8 = new Register8(); // 0xff23 - NR44

    constructor(audioCtx: AudioContext) {
        this.audioCtx = audioCtx;
    }

    setByte(address: number, data: number) {
        switch (address) {
            case 0xff20: return this.soundLength.set(data);
            case 0xff21: return this.volumeEnvelope.set(data);
            case 0xff22: return this.polynomialCounter.set(data);
            case 0xff23:
                this.selectionRegister.set(data);
                this.trigger = (data & 0x80) !== 0;
                return;
        }
    }

    getByte(address: number): number {
        switch (address) {
            case 0xff20: return 0xff;
            case 0xff21: return this.volumeEnvelope.get();
            case 0xff22: return this.polynomialCounter.get();
            case 0xff23: return this.selectionRegister.get() | 0xbf;
        }
        throw new Error('Unsupported SquareChannel register');
    }

    powerOff() {
        this.setByte(0xff20, 0);
        this.setByte(0xff21, 0);
        this.setByte(0xff22, 0);
        this.setByte(0xff23, 0);
    }

    isOn(): boolean {
        return this.trigger;
    }

    size() {
        return 4;
    }

}