import MMU from "../memory/MMU";
import Helper from "../utils/Helper";
import { CombinedRegister } from "./CombinedRegister";
import FlagRegister from "./FlagRegister";
import { Register16 } from "./Register16";
import { byteBuffer } from "../utils/ByteBuffer";
import { Opcode, FlagAffection } from "./Opcodes";
import { Register } from "./Register";

type InstructionSet = ((() => void) | null)[];
interface ExecutionResult {
    cycles?: number;
    zero?: boolean;
    subtract?: boolean;
    halfCarry?: boolean;
    carry?: boolean;
}

interface Operator<T> {
    set: (value: T) => void;
    get: () => T;
}

interface InstructionBuilderMap {
    [key: string]: (def: Opcode) => () => ExecutionResult
}

export default class CPU {

    private readonly mmu: MMU;
    private readonly instructionSet: InstructionSet;
    private readonly cbInstructionSet: InstructionSet;

    private readonly AF = new CombinedRegister(0x01b0);
    private readonly BC = new CombinedRegister(0x0013);
    private readonly DE = new CombinedRegister(0x00d8);
    private readonly HL = new CombinedRegister(0x014d);

    private readonly A = this.AF.high;
    private readonly F = new FlagRegister(this.AF.low);

    private readonly B = this.BC.high;
    private readonly C = this.BC.low;

    private readonly D = this.DE.high;
    private readonly E = this.DE.low;

    private readonly H = this.HL.high;
    private readonly L = this.HL.low;

    private readonly SP = new Register16(0xfffe);
    private readonly PC = new Register16(0x0100);

    constructor(configs: {
        mmu: MMU,
        instructionSetDefinition: Array<Opcode | null>,
        cbInstructionSetDefinition: Array<Opcode | null>
    }) {
        this.mmu = configs.mmu;
        this.instructionSet = this.buildInstructionSet(configs.instructionSetDefinition);
        this.cbInstructionSet = this.buildInstructionSet(configs.cbInstructionSetDefinition);
        console.log(this.toString());
    }

    run() {
        // fetch-decode-excute
        {
            const code = this.fetchCode(); // fetch
            const op = this.decodeToOp(code); // decode
            op(); // execute
            console.log(this.toString());
        }
    }

    private fetchCode(): number {
        return byteBuffer.value(this.mmu.getWord(byteBuffer.value(this.PC.data())));
    }

    private decodeToOp(code: number): () => void {
        const op = this.instructionSet[code];
        if (!op) {
            throw new Error(`The requested opcode [${Helper.toHexText(code, 4)}] does not exist in the instruction set`);
        }
        return op;
    }

    private buildInstructionSet(defs: Array<Opcode | null>): InstructionSet {
        return defs.map((def) => {
            if (!def) {
                return null;
            }

            const builder = this.instructionBuilderMap[def.operation];
            if (builder) {
                const executor = builder(def);
                return () => {
                    const { cycles, zero, subtract, halfCarry, carry } = executor();

                    // Update the CPU clock
                    if (cycles) {
                        this.updateClock(cycles);
                    } else {
                        this.updateClock(def.clock_cycles[0]);
                    }

                    // increment PC
                    this.updatePC(def.opcode_length);

                    // Update the Flag Register
                    const setFlag = (flag: 'zero' | 'subtract' | 'halfCarry' | 'carry', affection: FlagAffection, value?: boolean): void => {
                        if (affection === false) {
                            return;
                        }
                        let flagValue: boolean;
                        if (affection === true) {
                            if (value === undefined) throw new Error('Expected Flag value but got none: \n' + JSON.stringify(def, null, 4));
                            flagValue = value;
                        } else {
                            flagValue = affection === 1;
                        }
                        this.F[flag] = flagValue;
                    }

                    setFlag('zero', def.setZero, zero);
                    setFlag('subtract', def.setSubtract, subtract);
                    setFlag('halfCarry', def.setHalfCarry, halfCarry);
                    setFlag('carry', def.setCarry, carry);
                };
            }

            return () => { }; // FIXME
        });
    }

    private buildAddInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected two operands when building [ADD] Insturction:\n' + JSON.stringify(def, null, 4));
        const [target, source] = def.operands.map((operand) => this.parse(operand));

        return () => {
            const a = target.get();
            const b = source.get();
            const sum = a + b;
            target.set(sum);
            return {
                zero: sum === 0,
                carry: sum > 0xff,
                halfCarry: ((target.get() ^ b ^ a) & 0x10) !== 0
            };
        };
    }

    // returns a getter setter operation object of that operand
    private parse(operand: string): Operator<number> {
        if (operand === 'AF') return CPU.toOperator(this.AF);
        if (operand === 'BC') return CPU.toOperator(this.BC);
        if (operand === 'DE') return CPU.toOperator(this.DE);
        if (operand === 'HL') return CPU.toOperator(this.HL);
        if (operand === 'A') return CPU.toOperator(this.A);
        if (operand === 'B') return CPU.toOperator(this.B);
        if (operand === 'C') return CPU.toOperator(this.C);
        if (operand === 'D') return CPU.toOperator(this.D);
        if (operand === 'E') return CPU.toOperator(this.E);
        if (operand === 'H') return CPU.toOperator(this.H);
        if (operand === 'L') return CPU.toOperator(this.L);
        if (operand === 'SP') return CPU.toOperator(this.SP);
        if (operand === 'PC') return CPU.toOperator(this.PC);
        return CPU.toOperator(this.A); // FIXME
        // throw new Error(`Unsupported operand [${operand}]`);
    }

    private updateClock(cycles: number) {
        // TODO
    }

    private updatePC(length: number) {
        const result = byteBuffer.value(this.PC.data()) + length;
        this.PC.set(result);
    }

    private static toOperator(reg: Register): Operator<number> {
        return {
            set(byte: number) {
                reg.set(byte);
            },
            get() {
                return byteBuffer.value(reg.data());
            }
        };
    }

    toString() {
        return `AF: ${Helper.toHexText(this.AF, 4)}, BC: ${Helper.toHexText(this.BC, 4)}, DE: ${Helper.toHexText(this.DE, 4)}, HL: ${Helper.toHexText(this.HL, 4)}, SP: ${Helper.toHexText(this.SP, 4)}, PC: ${Helper.toHexText(this.PC, 4)}\n${this.F.toString()} `;
    }

    private readonly instructionBuilderMap: InstructionBuilderMap = {
        'ADD': this.buildAddInstruction
    };

}