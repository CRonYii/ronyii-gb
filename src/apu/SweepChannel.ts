import { Memory } from "../memory/Memory";
import { Register8 } from "../cpu/Register";

export default class SweepChannel implements Memory {

    private readonly audioCtx: AudioContext;

    private readonly sweepRegister: Register8 = new Register8(); // 0xff10 - NR10

    constructor(audioCtx: AudioContext) {
        this.audioCtx = audioCtx;
    }

    setByte(address: number, data: number) {
        this.sweepRegister.set(data);
    }

    getByte(address: number): number {
        return this.sweepRegister.get() & 0x7f;
    }

    size() {
        return 4;
    }

}