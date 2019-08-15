import { CARRY_FLAG, HALF_CARRY_FLFG, OPERATION_FLAG as SUBTRACT_FLAG, ZERO_FLAG } from "../constants/index";
import { Register8 } from "./Register";

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

    public toString() {
        return `zero: ${this.zero}, subtract: ${this.subtract}, half-carry: ${this.halfCarry}, carry: ${this.carry}`;
    }

}