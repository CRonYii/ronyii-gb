import MMU from "../memory/MMU";
import { byteBuffer } from "../utils/ByteBuffer";
import Helper from "../utils/Helper";
import { CombinedRegister } from "./CombinedRegister";
import FlagRegister from "./FlagRegister";
import { FlagAffection, Opcode } from "./Opcodes";
import { Register16 } from "./Register16";
import ALU, { ALUResult } from "./ALU";
import { debugEnabled } from "../index";

type InstructionSet = ((() => void) | null)[];

type DataType = 'd8' | 'd16' | 'r8' | 'a8' | 'a16';

function isDataType(arg: string): arg is DataType {
    return arg === 'd8' || arg === 'd16' || arg === 'r8' || arg === 'a8' || arg === 'a16';
}

type RegisterType =
    'AF' | 'BC' | 'DE' | 'HL' |
    'A' | 'F' | 'B' | 'C' |
    'D' | 'E' | 'H' | 'L' |
    'SP' | 'PC';

const registerTypes = [
    'AF', 'BC', 'DE', 'HL',
    'A', 'F', 'B', 'C',
    'D', 'E', 'H', 'L',
    'SP', 'PC'
];

function isRegisterType(arg: string): arg is RegisterType {
    return registerTypes.includes(arg);
}

type FlagMode = 'Z' | 'NZ' | 'C' | 'NC';

function isFlagMode(arg: string): arg is FlagMode {
    return arg === 'Z' || arg === 'NZ' || arg === 'C' || arg === 'NC';
}

function parseByteIndex(operand: string): number {
    const val = Number(operand);
    if (val >= 0 && val <= 7) {
        return val;
    }
    throw new Error('Expected a number in range [0, 7]');
}

const specialAddresses = [0x00, 0x08, 0x10, 0x18, 0x20, 0x28, 0x30, 0x38];

function parseSpecialAddress(operand: string): number {
    operand = '0x' + operand.substring(0, operand.length - 1);
    const val = Number(operand);
    if (specialAddresses.includes(val)) {
        return val;
    };
    throw new Error('Expected a number one of [0x00, 0x08, 0x10, 0x18, 0x20, 0x28, 0x30, 0x38], got ' + operand);
}

interface ExecutionResult {
    cycles?: number;
    zero?: boolean;
    subtract?: boolean;
    halfCarry?: boolean;
    carry?: boolean;
}

interface Operator<T> {
    size: number,
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

    private readonly AF = new CombinedRegister();
    private readonly BC = new CombinedRegister();
    private readonly DE = new CombinedRegister();
    private readonly HL = new CombinedRegister();

    private readonly A = this.AF.high;
    private readonly F = new FlagRegister(this.AF.low);

    private readonly B = this.BC.high;
    private readonly C = this.BC.low;

    private readonly D = this.DE.high;
    private readonly E = this.DE.low;

    private readonly H = this.HL.high;
    private readonly L = this.HL.low;

    private readonly SP = new Register16();
    private readonly PC = new Register16();

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

    exec() {
        // fetch-decode-excute
        const code = this.fetchCode(); // fetch
        const op = this.decodeToOp(code); // decode
        op(); // execute
    }

    private fetchCode(): number {
        return this.mmu.getByte(this.read('PC'));
    }

    private decodeToOp(code: number): () => void {
        const op = this.instructionSet[code];
        if (!op) {
            throw new Error(`The requested opcode [${Helper.toHexText(code, 4)}] does not exist in the instruction set`);
        }
        return op;
    }

    private decodeToCBOp(code: number): () => void {
        const op = this.cbInstructionSet[code];
        if (!op) {
            throw new Error(`The requested opcode [${Helper.toHexText(code, 4)}] does not exist in the CB instruction set`);
        }
        return op;
    }

    private readImmediateByte(): number {
        return this.mmu.getByte(this.read('PC') - 1);
    }

    private readImmediateWord(): number {
        return this.mmu.getWord(this.read('PC') - 2);
    }

    private updateClock(cycles: number) {
        // TODO
    }

    private updatePC(length: number) {
        const result = this.read('PC') + length;
        this.PC.set(result);
    }

    private increment(type: RegisterType) {
        const val = byteBuffer.value(this[type].data()) + 1;
        this[type].set(val);
    }

    private decrement(type: RegisterType) {
        const val = byteBuffer.value(this[type].data()) - 1;
        this[type].set(val);
    }

    private pushStack(data: number) {
        // decrement SP twice for 2 bytes of data
        this.decrement('SP');
        this.decrement('SP');
        this.mmu.setWord(this.read('SP'), data);
    }

    private popStack(): number {
        const data = this.mmu.getWord(this.read('SP'));

        // increment SP twice for 2 bytes of data
        this.increment('SP');
        this.increment('SP');
        return data;
    }

    private halt() {
        // TODO
    }

    private stop() {
        // TODO
    }

    private setInterrupts(flag: boolean) {
        // TODO
    }

    private initRegisters() {
        this.AF.set(0x01b0);
        this.BC.set(0x0013);
        this.DE.set(0x00d8);
        this.HL.set(0x014d);
        this.SP.set(0xfffe);
        this.PC.set(0x0100);
    }

    private buildInstructionSet(defs: Array<Opcode | null>): InstructionSet {
        return defs.map((def) => {
            if (!def) {
                return null;
            }

            const builder = this.instructionBuilderMap[def.operation];
            if (!builder) {
                throw new Error('Unsupported operation: ' + def.operation);
            }
            const executor = builder(def);
            return () => {
                this.updatePC(def.opcode_length);

                const { cycles, zero, subtract, halfCarry, carry } = executor();

                // Update the CPU clock
                if (cycles) {
                    this.updateClock(cycles);
                } else {
                    this.updateClock(def.clock_cycles[0]);
                }

                // increment PC

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

                if (debugEnabled)
                    console.log(def.label);
            };
        });
    }

    private buildNOPInstruction = (def: Opcode): () => ExecutionResult => {
        return () => { return {} };
    }

    private buildLDInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected two operands when building [LD] Insturction:\n' + JSON.stringify(def, null, 4));
        const [target, source] = def.operands.map((operand) => this.parseOperator(operand));

        return () => {
            target.set(source.get());
            return {};
        };
    }

    private buildLDHLInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected two operands when building [LD] Insturction:\n' + JSON.stringify(def, null, 4));
        const [SP, n] = def.operands.map((operand) => this.parseOperator(operand));

        return () => {
            const a = SP.get();
            const b = n.get();
            const sum = a + b;
            this.HL.set(sum);
            return {
                carry: sum > 0xffff,
                halfCarry: ((SP.get() ^ b ^ a) & 0x100) !== 0
            };
        };
    }

    private buildPUSHInstruction = (def: Opcode): () => ExecutionResult => {
        return () => {
            if (!def.operands) throw new Error('Expected one operands when building [PUSH] Insturction:\n' + JSON.stringify(def, null, 4));
            const [source] = def.operands.map((operand) => this.parseOperator(operand));

            this.pushStack(source.get());

            return {}
        };
    }

    private buildPOPInstruction = (def: Opcode): () => ExecutionResult => {
        return () => {
            if (!def.operands) throw new Error('Expected one operands when building [PUSH] Insturction:\n' + JSON.stringify(def, null, 4));
            const [target] = def.operands.map((operand) => this.parseOperator(operand));

            target.set(this.popStack());

            return { zero: this.F.zero, subtract: this.F.subtract, halfCarry: this.F.halfCarry, carry: this.F.carry }
        };
    }

    private buildADDInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected two operands when building [ADD] Insturction:\n' + JSON.stringify(def, null, 4));
        const [target, source] = def.operands.map((operand) => this.parseOperator(operand));

        let addition: (a: number, b: number) => ALUResult;

        if (source.size === 1) {
            addition = ALU.add8;
        } else if (source.size === 2) {
            addition = ALU.add16;
        } else {
            throw new Error('Unsupported Addition building config');
        }

        return () => {
            const result = addition(target.get(), source.get());
            target.set(result.result);

            return result;
        };
    }

    private buildADCInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected two operands when building [ADC] Insturction:\n' + JSON.stringify(def, null, 4));
        const [target, source] = def.operands.map((operand) => this.parseOperator(operand));

        let addition: (a: number, b: number, carry: boolean) => ALUResult;

        if (source.size === 1) {
            addition = ALU.add8;
        } else if (source.size === 2) {
            addition = ALU.add16;
        } else {
            throw new Error('Unsupported Addition building config');
        }

        return () => {
            const result = addition(target.get(), source.get(), this.F.carry);
            target.set(result.result);

            return result;
        };
    }

    private buildSUBInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected one operands when building [SUB] Insturction:\n' + JSON.stringify(def, null, 4));
        const [source] = def.operands.map((operand) => this.parseOperator(operand));

        return () => {
            const result = ALU.sub8(this.read('A'), source.get());
            this.A.set(result.result);

            return result;
        };
    }

    private buildSBCInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected two operands when building [SBC] Insturction:\n' + JSON.stringify(def, null, 4));
        const [target, source] = def.operands.map((operand) => this.parseOperator(operand));

        return () => {
            const result = ALU.sub8(target.get(), source.get(), this.F.carry);
            target.set(result.result);

            return result;
        };
    }

    private buildANDInstruction = (def: Opcode): () => ExecutionResult => {
        return () => {
            if (!def.operands) throw new Error('Expected one operands when building [OR] Insturction:\n' + JSON.stringify(def, null, 4));
            const [source] = def.operands.map((operand) => this.parseOperator(operand));

            const result = ALU.and(this.read('A'), source.get());
            this.A.set(result.result);

            return result;
        };
    }

    private buildORInstruction = (def: Opcode): () => ExecutionResult => {
        return () => {
            if (!def.operands) throw new Error('Expected one operands when building [OR] Insturction:\n' + JSON.stringify(def, null, 4));
            const [source] = def.operands.map((operand) => this.parseOperator(operand));

            const result = ALU.or(this.read('A'), source.get());
            this.A.set(result.result);

            return result;
        };
    }

    private buildXORInstruction = (def: Opcode): () => ExecutionResult => {
        return () => {
            if (!def.operands) throw new Error('Expected one operands when building [XOR] Insturction:\n' + JSON.stringify(def, null, 4));
            const [source] = def.operands.map((operand) => this.parseOperator(operand));

            const result = ALU.xor(this.read('A'), source.get());
            this.A.set(result.result);

            return result;
        };
    }

    private buildCPInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected one operands when building [CP] Insturction:\n' + JSON.stringify(def, null, 4));
        const [source] = def.operands.map((operand) => this.parseOperator(operand));

        return () => {
            const result = ALU.sub8(this.read('A'), source.get());

            return result;
        };
    }

    private buildINCInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected one operands when building [INC] Insturction:\n' + JSON.stringify(def, null, 4));
        const [target] = def.operands.map((operand) => this.parseOperator(operand));

        let addition: (a: number, b: number) => ALUResult;

        if (target.size === 1) {
            addition = ALU.add8;
        } else if (target.size === 2) {
            addition = ALU.add16;
        } else {
            throw new Error('Unsupported Addition building config');
        }

        return () => {
            const result = addition(target.get(), 1);
            target.set(result.result);

            return result;
        };
    }

    private buildDECInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected one operands when building [DEC] Insturction:\n' + JSON.stringify(def, null, 4));
        const [target] = def.operands.map((operand) => this.parseOperator(operand));

        let subtraction: (a: number, b: number) => ALUResult;

        if (target.size === 1) {
            subtraction = ALU.sub8;
        } else if (target.size === 2) {
            subtraction = ALU.sub16;
        } else {
            throw new Error('Unsupported Subtraction building config');
        }

        return () => {
            const result = subtraction(target.get(), 1);
            target.set(result.result);

            return result;
        };
    }

    private buildSWAPInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected one operands when building [SWAP] Insturction:\n' + JSON.stringify(def, null, 4));
        const [target] = def.operands.map((operand) => this.parseOperator(operand));

        return () => {
            const result = ALU.swap8(target.get());
            target.set(result.result);

            return result;
        };
    }

    private buildDAAInstruction = (def: Opcode): () => ExecutionResult => {
        return () => {
            let a = this.read('A');
            let carry = false;
            if (this.F.halfCarry || (this.read('A') & 0xf) > 0x9) {
                a += 0x6;
            }
            if (this.F.halfCarry || this.read('A') > 0x99) {
                a += 0x60;
                carry = true;
            }
            a &= 0xff;

            return { zero: a === 0, carry };
        };
    }

    private buildCPLInstruction = (def: Opcode): () => ExecutionResult => {
        return () => {
            const val = this.read('A');
            this.A.set(~val);

            return {};
        };
    }

    private buildCCFInstruction = (def: Opcode): () => ExecutionResult => {
        return () => {
            return { carry: !this.F.carry };
        };
    }

    private buildSCFInstruction = (def: Opcode): () => ExecutionResult => {
        return () => {
            return { carry: true };
        };
    }

    private buildHALTInstruction = (def: Opcode): () => ExecutionResult => {
        return () => {
            this.halt();
            return {};
        };
    }

    private buildSTOPInstruction = (def: Opcode): () => ExecutionResult => {
        return () => {
            this.stop();
            return {};
        };
    }

    private buildDIInstruction = (def: Opcode): () => ExecutionResult => {
        return () => {
            this.setInterrupts(false);
            return {};
        };
    }

    private buildEIInstruction = (def: Opcode): () => ExecutionResult => {
        return () => {
            this.setInterrupts(true);
            return {};
        };
    }

    private buildRLCAInstruction = (def: Opcode): () => ExecutionResult => {
        return () => {
            const result = ALU.shiftLeft8(this.read('A'), true);
            this.A.set(result.result);

            return result;
        };
    }

    private buildRLAInstruction = (def: Opcode): () => ExecutionResult => {
        return () => {
            const result = ALU.shiftLeft8(this.read('A'), true, this.F.carry);
            this.A.set(result.result);

            return result;
        };
    }

    private buildRRCAInstruction = (def: Opcode): () => ExecutionResult => {
        return () => {
            const result = ALU.shiftRight8(this.read('A'), true);
            this.A.set(result.result);

            return result;
        };
    }

    private buildRRAInstruction = (def: Opcode): () => ExecutionResult => {
        return () => {
            const result = ALU.shiftRight8(this.read('A'), true, this.F.carry);
            this.A.set(result.result);

            return result;
        };
    }

    private buildRLCInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected one operands when building [RLC] Insturction:\n' + JSON.stringify(def, null, 4));
        const [target] = def.operands.map((operand) => this.parseOperator(operand));

        return () => {
            const result = ALU.shiftLeft8(target.get(), true);
            target.set(result.result);

            return result;
        };
    }

    private buildRLInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected one operands when building [RL] Insturction:\n' + JSON.stringify(def, null, 4));
        const [target] = def.operands.map((operand) => this.parseOperator(operand));

        return () => {
            const result = ALU.shiftLeft8(target.get(), true, this.F.carry);
            target.set(result.result);

            return result;
        };
    }

    private buildRRCInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected one operands when building [RRC] Insturction:\n' + JSON.stringify(def, null, 4));
        const [target] = def.operands.map((operand) => this.parseOperator(operand));

        return () => {
            const result = ALU.shiftRight8(target.get(), true);
            target.set(result.result);

            return result;
        };
    }

    private buildRRInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected one operands when building [RR] Insturction:\n' + JSON.stringify(def, null, 4));
        const [target] = def.operands.map((operand) => this.parseOperator(operand));

        return () => {
            const result = ALU.shiftRight8(target.get(), true, this.F.carry);
            target.set(result.result);

            return result;
        };
    }

    private buildSLAInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected one operands when building [SLA] Insturction:\n' + JSON.stringify(def, null, 4));
        const [target] = def.operands.map((operand) => this.parseOperator(operand));

        return () => {
            const result = ALU.shiftLeft8(target.get(), false);
            target.set(result.result);

            return result;
        };
    }

    private buildSRAInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected one operands when building [SRA] Insturction:\n' + JSON.stringify(def, null, 4));
        const [target] = def.operands.map((operand) => this.parseOperator(operand));

        return () => {
            const value = target.get();
            let { result, carry } = ALU.shiftRight8(value, false);

            const leftMostBit = value & 0x80;
            result |= leftMostBit;

            target.set(result);

            return { zero: result === 0, carry };
        };
    }

    private buildSRLInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected one operands when building [SRL] Insturction:\n' + JSON.stringify(def, null, 4));
        const [target] = def.operands.map((operand) => this.parseOperator(operand));

        return () => {
            const result = ALU.shiftRight8(target.get(), false);
            target.set(result.result);

            return result;
        };
    }

    private buildBITInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected two operands when building [BIT] Insturction:\n' + JSON.stringify(def, null, 4));
        const index = 1 << parseByteIndex(def.operands[0]);
        const target = this.parseOperator(def.operands[1]);

        return () => {
            return { zero: (target.get() & index) === 0 };
        };
    }

    private buildSETInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected two operands when building [SET] Insturction:\n' + JSON.stringify(def, null, 4));
        const index = 1 << parseByteIndex(def.operands[0]);
        const target = this.parseOperator(def.operands[1]);

        return () => {
            const value = target.get() | index;
            target.set(value);
            return {};
        };
    }

    private buildRESInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected two operands when building [RES] Insturction:\n' + JSON.stringify(def, null, 4));
        const index = ~(1 << parseByteIndex(def.operands[0]));
        const target = this.parseOperator(def.operands[1]);

        return () => {
            const value = target.get() & index;
            target.set(value);
            return {};
        };
    }

    private buildJPInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected 1 ~ 2 operands when building [JP] Insturction:\n' + JSON.stringify(def, null, 4));

        if (def.operands.length === 1) {
            const target = this.parseOperator(def.operands[0]);
            return () => {
                this.PC.set(target.get());
                return {};
            };
        } else if (def.operands.length === 2) {
            const mode = def.operands[0];
            const target = this.parseOperator(def.operands[1]);

            return () => {
                if (!this.shouldExecute(mode)) {
                    return { cycles: def.clock_cycles[1] };
                }
                this.PC.set(target.get());
                return {};
            };
        } else {
            throw new Error('Expected 1 ~ 2 operands');
        }
    }

    private buildJRInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected 1 ~ 2 operands when building [JR] Insturction:\n' + JSON.stringify(def, null, 4));

        if (def.operands.length === 1) {
            const target = this.parseOperator(def.operands[0]);
            return () => {
                this.PC.set(this.read('PC') + target.get());
                return {};
            };
        } else if (def.operands.length === 2) {
            const mode = def.operands[0];
            const target = this.parseOperator(def.operands[1]);

            return () => {
                if (!this.shouldExecute(mode)) {
                    return { cycles: def.clock_cycles[1] };
                }
                this.PC.set(this.read('PC') + target.get());
                return {};
            };
        } else {
            throw new Error('Expected 1 ~ 2 operands');
        }
    }

    private buildCALLInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected 1 ~ 2 operands when building [CALL] Insturction:\n' + JSON.stringify(def, null, 4));

        if (def.operands.length === 1) {
            const target = this.parseOperator(def.operands[0]);
            return () => {
                this.pushStack(this.read('PC'));
                this.PC.set(target.get());
                return {};
            };
        } else if (def.operands.length === 2) {
            const mode = def.operands[0];
            const target = this.parseOperator(def.operands[1]);

            return () => {
                if (!this.shouldExecute(mode)) {
                    return { cycles: def.clock_cycles[1] };
                }
                this.pushStack(this.read('PC'));
                this.PC.set(target.get());
                return {};
            };
        } else {
            throw new Error('Expected 1 ~ 2 operands');
        }
    }

    private buildRSTInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected one operands when building [RST] Insturction:\n' + JSON.stringify(def, null, 4));

        const target = parseSpecialAddress(def.operands[0]);

        return () => {
            // TODO: rsv() save the current register values temporarily
            this.pushStack(this.read('PC'));
            this.PC.set(target);
            return {}
        };
    }

    private buildRETInstruction = (def: Opcode): () => ExecutionResult => {
        if (def.operands) {
            const mode = def.operands[0];

            return () => {
                if (!this.shouldExecute(mode)) {
                    return { cycles: def.clock_cycles[1] };
                }
                this.PC.set(this.popStack());
                return {};
            };
        } else {
            return () => {
                this.PC.set(this.popStack());
                return {}
            };
        }
    }

    private buildRETIInstruction = (def: Opcode): () => ExecutionResult => {
        return () => {
            this.PC.set(this.popStack());
            this.setInterrupts(true);
            // TODO: rrs() restore all the previous register values
            return {}
        };
    }

    private buildCBInstruction = (def: Opcode): () => ExecutionResult => {
        return () => {
            const code = this.fetchCode(); // fetch
            const op = this.decodeToCBOp(code); // op
            op(); // execute
            return {}
        };
    }

    private readonly instructionBuilderMap: InstructionBuilderMap = {
        'NOP': this.buildNOPInstruction,
        'LD': this.buildLDInstruction,
        'LDH': this.buildLDInstruction,
        'LDHL': this.buildLDHLInstruction,
        'PUSH': this.buildPUSHInstruction,
        'POP': this.buildPOPInstruction,
        'ADD': this.buildADDInstruction,
        'ADC': this.buildADCInstruction,
        'SUB': this.buildSUBInstruction,
        'SBC': this.buildSBCInstruction,
        'AND': this.buildANDInstruction,
        'OR': this.buildORInstruction,
        'XOR': this.buildXORInstruction,
        'CP': this.buildCPInstruction,
        'INC': this.buildINCInstruction,
        'DEC': this.buildDECInstruction,
        'SWAP': this.buildSWAPInstruction,
        'DAA': this.buildDAAInstruction,
        'CPL': this.buildCPLInstruction,
        'CCF': this.buildCCFInstruction,
        'SCF': this.buildSCFInstruction,
        'HALT': this.buildHALTInstruction,
        'STOP': this.buildSTOPInstruction,
        'DI': this.buildDIInstruction,
        'EI': this.buildEIInstruction,
        'RLCA': this.buildRLCAInstruction,
        'RLA': this.buildRLAInstruction,
        'RRCA': this.buildRRCAInstruction,
        'RRA': this.buildRRAInstruction,
        'RLC': this.buildRLCInstruction,
        'RL': this.buildRLInstruction,
        'RRC': this.buildRRCInstruction,
        'RR': this.buildRRInstruction,
        'SLA': this.buildSLAInstruction,
        'SRA': this.buildSRAInstruction,
        'SRL': this.buildSRLInstruction,
        'BIT': this.buildBITInstruction,
        'SET': this.buildSETInstruction,
        'RES': this.buildRESInstruction,
        'JP': this.buildJPInstruction,
        'JR': this.buildJRInstruction,
        'CALL': this.buildCALLInstruction,
        'RST': this.buildRSTInstruction,
        'RET': this.buildRETInstruction,
        'RETI': this.buildRETIInstruction,
        'PREFIX': this.buildCBInstruction,
    };

    shouldExecute(flagMode: string): boolean {
        if (!isFlagMode(flagMode)) {
            throw new Error(`Invalid flag mode value [${flagMode}]`);
        }
        switch (flagMode) {
            case 'NZ': return !this.F.zero;
            case 'Z': return this.F.zero;
            case 'NC': return !this.F.carry;
            case 'C': return this.F.carry;
        }
    }

    // returns a getter setter operation object of that operand
    private parseOperator(operand: string): Operator<number> {
        let mem = Helper.parseParentheses(operand);
        if (mem) {
            if (mem === 'a16') {
                return this.toImmediateMemoryOperator('a16');
            }
            if (mem === 'a8') {
                return this.toImmediateMemoryOperator('a8');
            }
            const lastChar = mem[mem.length - 1];
            let sign: '+' | '-' | undefined;
            if (lastChar === '+' || lastChar === '-') {
                sign = lastChar;
                mem = mem.substring(0, mem.length - 1);
            }
            if (isRegisterType(mem)) {
                return this.toMemoryOperator(mem, sign);
            }
        }
        if (isRegisterType(operand)) {
            return this.toRegisterOperator(operand);
        }
        if (isDataType(operand)) {
            return this.toImmediateMemoryOperator(operand);
        }

        throw new Error(`Unsupported operand [${operand}]`);
    }

    private toMemoryOperator(type: RegisterType, sign?: '+' | '-'): Operator<number> {
        const reg = this[type];
        let address = byteBuffer.value(reg.data());
        if (reg.size() === 1) {
            address = 0xff00 | address;
        }
        const handleSign = () => {
            if (sign === '+') {
                this.increment(type);
            } else {
                this.decrement(type);
            }
        };
        return {
            size: 1,
            set: (byte: number) => {
                this.mmu.setByte(address, byte);
                handleSign();
            },
            get: () => {
                const val = this.mmu.getByte(address);
                handleSign();
                return val;
            }
        };
    }

    private toImmediateMemoryOperator(type: DataType): Operator<number> {
        switch (type) {
            case 'd8':
                return {
                    size: 1,
                    set: (byte: number) => { throw new Error('Unsupported operation'); },
                    get: () => { return this.readImmediateByte(); }
                };
            case 'd16':
                return {
                    size: 2,
                    set: (byte: number) => { throw new Error('Unsupported operation'); },
                    get: () => { return this.readImmediateWord(); }
                };
            case 'r8':
                return {
                    size: 1,
                    set: (byte: number) => { throw new Error('Unsupported operation'); },
                    get: () => { return Helper.toSigned8(this.readImmediateByte()); }
                };
            case 'a8':
                return {
                    size: 1,
                    set: (byte: number) => { this.mmu.setByte(this.readImmediateByte() | 0xff00, byte) },
                    get: () => { return this.readImmediateByte() | 0xff00; }
                };
            case 'a16':
                return {
                    size: 2,
                    set: (byte: number) => { this.mmu.setWord(this.readImmediateWord(), byte) },
                    get: () => { return this.readImmediateWord(); }
                };
        }
    }

    private toRegisterOperator(regType: RegisterType): Operator<number> {
        const reg = this[regType];
        return {
            size: reg.size(),
            set(byte: number) {
                reg.set(byte);
            },
            get() {
                return byteBuffer.value(reg.data());
            }
        };
    }

    private read(type: RegisterType): number {
        return byteBuffer.value(this[type].data());
    }

    toString() {
        return `AF: ${Helper.toHexText(this.AF, 4)}, BC: ${Helper.toHexText(this.BC, 4)}, DE: ${Helper.toHexText(this.DE, 4)}, HL: ${Helper.toHexText(this.HL, 4)}, SP: ${Helper.toHexText(this.SP, 4)}, PC: ${Helper.toHexText(this.PC, 4)}\n${this.F.toString()} `;
    }

}