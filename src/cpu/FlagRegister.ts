import { Register8 } from "./Register";

const ZERO_FLAG = 0x80;

const SUBTRACT_FLAG = 0x40;

const HALF_CARRY_FLFG = 0x20;

const CARRY_FLAG = 0X10;

export default class FlagRegister extends Register8 {

    set(value: number) {
        super.set(value & 0xf0);
    }

    set zero(flag: boolean) {
        const byte = flag
            ? ZERO_FLAG | this.get()
            : ~ZERO_FLAG & this.get();
        this.set(byte);
    }

    get zero(): boolean {
        return (this.get() & ZERO_FLAG) !== 0;
    }

    set subtract(flag: boolean) {
        const byte = flag
            ? SUBTRACT_FLAG | this.get()
            : ~SUBTRACT_FLAG & this.get();
        this.set(byte);
    }

    get subtract(): boolean {
        return (this.get() & SUBTRACT_FLAG) !== 0;
    }

    set halfCarry(flag: boolean) {
        const byte = flag
            ? HALF_CARRY_FLFG | this.get()
            : ~HALF_CARRY_FLFG & this.get();
        this.set(byte);
    }

    get halfCarry(): boolean {
        return (this.get() & HALF_CARRY_FLFG) !== 0;
    }

    set carry(flag: boolean) {
        const byte = flag
            ? CARRY_FLAG | this.get()
            : ~CARRY_FLAG & this.get();
        this.set(byte);
    }

    get carry(): boolean {
        return (this.get() & CARRY_FLAG) !== 0;
    }

}