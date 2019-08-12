import MMU from "../memory/MMU";
import { byteBuffer } from "../utils/ByteBuffer";
import Helper from "../utils/Helper";
import { CombinedRegister } from "./CombinedRegister";
import FlagRegister from "./FlagRegister";
import { FlagAffection, Opcode } from "./Opcodes";
import { Register16 } from "./Register16";

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

    private buildNOPInstruction = (def: Opcode): () => ExecutionResult => {
        return () => { return {} };
    }

    private buildLDInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected two operands when building [LD] Insturction:\n' + JSON.stringify(def, null, 4));
        const [target, source] = def.operands.map((operand) => this.parse(operand));

        return () => {
            target.set(source.get());
            return {};
        };
    }

    private buildLDHLInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected two operands when building [LD] Insturction:\n' + JSON.stringify(def, null, 4));
        const [SP, n] = def.operands.map((operand) => this.parse(operand));

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
            const [source] = def.operands.map((operand) => this.parse(operand));

            // decrement SP twice for 2 bytes of data
            this.decrement('SP');
            this.decrement('SP');
            this.mmu.setWord(this.read('SP'), source.get());

            return {}
        };
    }

    private buildPOPInstruction = (def: Opcode): () => ExecutionResult => {
        return () => {
            if (!def.operands) throw new Error('Expected one operands when building [PUSH] Insturction:\n' + JSON.stringify(def, null, 4));
            const [target] = def.operands.map((operand) => this.parse(operand));

            const data = this.mmu.getWord(this.read('SP'));
            target.set(data);
            // increment SP twice for 2 bytes of data
            this.increment('SP');
            this.increment('SP');

            return {}
        };
    }

    private buildADDInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected two operands when building [ADD] Insturction:\n' + JSON.stringify(def, null, 4));
        const [target, source] = def.operands.map((operand) => this.parse(operand));

        if (source.size === 1) {
            return () => {
                const a = target.get();
                const b = source.get();
                const sum = a + b;
                target.set(sum);
                return {
                    zero: (sum & 0xff) === 0,
                    carry: sum > 0xff,
                    halfCarry: ((target.get() ^ b ^ a) & 0x10) !== 0
                };
            };
        } else if (source.size === 2) {
            return () => {
                const a = target.get();
                const b = source.get();
                const sum = a + b;
                target.set(sum);
                return {
                    carry: sum > 0xffff,
                    halfCarry: ((target.get() ^ b ^ a) & 0x100) !== 0
                };
            };
        }
        throw new Error('Unsupported Addition building config');
    }

    private readonly instructionBuilderMap: InstructionBuilderMap = {
        'NOP': this.buildNOPInstruction,
        'LD': this.buildLDInstruction,
        'LDH': this.buildLDInstruction,
        'LDHL': this.buildLDHLInstruction,
        'ADD': this.buildADDInstruction,
        'PUSH': this.buildPUSHInstruction,
        'POP': this.buildPOPInstruction,
    };

    // returns a getter setter operation object of that operand
    private parse(operand: string): Operator<number> {
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

    private readImmediateByte(): number {
        return this.mmu.getByte(this.read('PC') + 1);
    }

    private readImmediateWord(): number {
        return this.mmu.getWord(this.read('PC') + 1);
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
                    size: 1,
                    set: (byte: number) => { this.mmu.setByte(this.readImmediateByte(), byte) },
                    get: () => { return this.readImmediateByte(); }
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