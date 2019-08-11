import { CARRY_FLAG, HALF_CARRY_FLFG, OPERATION_FLAG as SUBTRACT_FLAG, ZERO_FLAG } from "../constants/index";
import { InnerRegister8 } from "./CombinedRegister";

export default class FlagRegister {

    private readonly reg: InnerRegister8;

    constructor(reg: InnerRegister8) {
        this.reg = reg;
    }

    byte(): number {
        return this.reg.data()[0];
    }

    set(byte: number) {
        this.reg.set(byte);
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

    set subtract(flag: boolean) {
        const byte = flag
            ? SUBTRACT_FLAG | this.byte()
            : ~SUBTRACT_FLAG & this.byte();
        this.set(byte);
    }

    get subtract(): boolean {
        return (this.byte() & SUBTRACT_FLAG) !== 0;
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
        return `zero: ${this.zero}, operation: ${this.subtract}, half-carry: ${this.halfCarry}, carry: ${this.carry}`;
    }

}