import Register8 from "./Register8";
import { ZERO_FLAG, OPERATION_FLAG, HALF_CARRY_FLFG, CARRY_FLAG } from "../constants/index";

export default class FlagRegister extends Register8 {

    constructor() {
        super();
    }

    set zero(flag: boolean) {
        const byte = flag
            ? ZERO_FLAG | this.byte()
            : ~ZERO_FLAG & this.byte();
        this.set(byte);
    }

    get zero(): boolean {
        return (this.byte() & ZERO_FLAG) !== 0;
    }

    set operation(flag: boolean) {
        const byte = flag
            ? OPERATION_FLAG | this.byte()
            : ~OPERATION_FLAG & this.byte();
        this.set(byte);
    }

    get operation(): boolean {
        return (this.byte() & OPERATION_FLAG) !== 0;
    }

    set halfCarry(flag: boolean) {
        const byte = flag
            ? HALF_CARRY_FLFG | this.byte()
            : ~HALF_CARRY_FLFG & this.byte();
        this.set(byte);
    }

    get halfCarry(): boolean {
        return (this.byte() & HALF_CARRY_FLFG) !== 0;
    }

    set carry(flag: boolean) {
        const byte = flag
            ? CARRY_FLAG | this.byte()
            : ~CARRY_FLAG & this.byte();
        this.set(byte);
    }

    get carry(): boolean {
        return (this.byte() & CARRY_FLAG) !== 0;
    }

    public toString() {
        return `zero: ${this.zero}, operation: ${this.operation}, half-carry: ${this.halfCarry}, carry: ${this.carry}`;
    }

}