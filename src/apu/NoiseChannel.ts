import { Memory } from "../memory/Memory";
import { Register8 } from "../cpu/Register";

export default class NoiseChannel implements Memory {

    private readonly audioCtx: AudioContext;

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
            case 0xff23: return this.selectionRegister.set(data);
        }
    }

    getByte(address: number): number {
        switch (address) {
            case 0xff20: return this.soundLength.get() & 0x3f;
            case 0xff21: return this.volumeEnvelope.get();
            case 0xff22: return this.polynomialCounter.get();
            case 0xff23: return this.selectionRegister.get() & 0x40;
        }
        throw new Error('Unsupported SquareChannel register');
    }

    size() {
        return 4;
    }

}