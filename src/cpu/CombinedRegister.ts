import { Register, Register8 } from "./Register";

export class CombinedRegister16 implements Register {

    private readonly high: Register8;
    private readonly low: Register8;

    constructor(high: Register8, low: Register8) {
        this.high = high;
        this.low = low;
    }

    set(data: number) {
        this.high.set((data & 0xff00) >> 8);
        this.low.set(data & 0x00ff);
    }

    get() {
        return (this.high.get() << 8) | this.low.get();
    }

    size() {
        return 2;
    }

}