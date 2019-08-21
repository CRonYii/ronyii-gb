import { debugEnabled } from "../index";
import { InterruptFlagsEKey } from "../memory/IORegisters";
import MMU from "../memory/MMU";
import Helper from "../utils/Helper";
import ALU, { ALUResult } from "./ALU";
import Clock from "./Clock";
import { CombinedRegister16 } from "./CombinedRegister";
import FlagRegister from "./FlagRegister";
import { CB_OPCODES, FlagAffection, Opcode, OPCODES } from "./Opcodes";
import { Register16, Register8 } from "./Register";
import { MemoryDebuggerConfig } from "../memory/MemoryDebugger";
import { RSTAddress, RegisterType, parseByteIndex, parseRSTAddress, isFlagMode, isDataType, isRegisterType, DataType } from "../utils/OpcodeTypes";

export interface CPUConfig {
    mmu: MMU,
    clock: Clock,
    debuggerConfig?: CPUDebuggerConfig,
    memoryDebuggerConfig?: MemoryDebuggerConfig,
}

export default class CPU {

    private readonly mmu: MMU;
    private readonly instructionSet: InstructionSet;
    private readonly cbInstructionSet: InstructionSet;

    private readonly A = new Register8();
    private readonly F = new FlagRegister();

    private readonly B = new Register8();
    private readonly C = new Register8();

    private readonly D = new Register8();
    private readonly E = new Register8();

    private readonly H = new Register8();
    private readonly L = new Register8();

    private readonly AF = new CombinedRegister16(this.A, this.F);
    private readonly BC = new CombinedRegister16(this.B, this.C);
    private readonly DE = new CombinedRegister16(this.D, this.E);
    private readonly HL = new CombinedRegister16(this.H, this.L);

    private readonly SP = new Register16();
    private readonly PC = new Register16();

    private haltFlag: boolean = false;
    private interruptsMasterEnable: boolean = false;

    private debuggerConfig?: CPUDebuggerConfig;
    private memoryDebuggerConfig?: MemoryDebuggerConfig;
    private shouldPause: boolean = false;

    constructor(configs: CPUConfig) {
        this.mmu = configs.mmu;
        this.instructionSet = this.buildInstructionSet(OPCODES);
        this.cbInstructionSet = this.buildInstructionSet(CB_OPCODES);
        this.debuggerConfig = configs.debuggerConfig;
        this.memoryDebuggerConfig = configs.memoryDebuggerConfig;
        this.initRegisters();
        configs.clock.add(this.next.bind(this));
    }

    private cpuLogs: string[] = [];

    private next() {
        const result = this.debug();
        const cyclesTaken = this.exec();
        this.shouldPause = this.shouldPause || result;
        if (this.shouldPause) {
            this.shouldPause = false;
            return 'pause';
        }
        return cyclesTaken;
    }

    public exec(): number {
        const result = this.handleInterrupt();
        if (result !== 0) {
            return result;
        } else if (this.isHalt()) {
            return 4;
        } else {
            this.log(false);
            // fetch-decode-excute
            const code = this.fetchCode(); // fetch
            const op = this.decodeToOp(code); // decode
            return op(); // execute
        }
    }

    private handleInterrupt() {
        if (!this.isHalt() && !this.interruptsMasterEnable) {
            return 0;
        }
        if ((this.mmu.interruptEnableManager.flag() & this.mmu.interruptFlagsManager.flag()) === 0) {
            return 0;
        }
        this.halt(false);
        if (!this.interruptsMasterEnable) {
            return 0;
        }

        if (this.mmu.shouldInterrupt('VBlank')) {
            return this.interrupt('VBlank');
        } else if (this.mmu.shouldInterrupt('LCDC')) {
            return this.interrupt('LCDC');
        } else if (this.mmu.shouldInterrupt('Timer')) {
            return this.interrupt('Timer');
        } else if (this.mmu.shouldInterrupt('Serial')) {
            return this.interrupt('Serial');
        } else if (this.mmu.shouldInterrupt('Joypad')) {
            return this.interrupt('Joypad');
        }

        return 0;
    }

    private interrupt(type: InterruptFlagsEKey) {
        if (debugEnabled.interrupts) {
            console.warn(`CPU INTERRUPTS => ${type}`);
        }
        this.setInterrupts(false); // disable master enable because only one interrupt can take place at the same time
        this.mmu.interruptFlagsManager.set(type, false); // disable the flag since it's in progess
        if (type === 'VBlank') {
            this.performRST(0x40);
        } else if (type === 'LCDC') {
            this.performRST(0x48);
        } else if (type === 'Timer') {
            this.performRST(0x50);
        } else if (type === 'Serial') {
            this.performRST(0x58);
        } else if (type === 'Joypad') {
            this.performRST(0x60);
        }
        return 16;
    }

    private fetchCode(): number {
        return this.mmu.getByte(this.read('PC'));
    }

    private decodeToOp(code: number): OpcodeExecutor {
        const op = this.instructionSet[code];
        if (!op) {
            throw new Error(`The requested opcode [${Helper.toHexText(code, 4)}] does not exist in the instruction set`);
        }
        return op;
    }

    private decodeToCBOp(code: number): OpcodeExecutor {
        const op = this.cbInstructionSet[code];
        if (!op) {
            throw new Error(`The requested opcode [${Helper.toHexText(code, 4)}] does not exist in the CB instruction set`);
        }
        return op;
    }

    private log(isCB: boolean) {
        if (debugEnabled.cpuLogs) {
            let opcode;
            if (isCB) {
                opcode = CB_OPCODES[this.fetchCode()];
            } else {
                opcode = OPCODES[this.fetchCode()];
            }
            if (!opcode) {
                return;
            }
            this.cpuLogs.push(`PC: ${Helper.toHexText(this.PC.get(), 4)} AF: ${Helper.toHexText(this.AF.get(), 4)} BC: ${Helper.toHexText(this.BC.get(), 4)} DE: ${Helper.toHexText(this.DE.get(), 4)} HL: ${Helper.toHexText(this.HL.get(), 4)} SP: ${Helper.toHexText(this.SP.get(), 4)} ${opcode.label}`);
        }
    }

    public getLog() {
        return this.cpuLogs.slice(0);
    }

    private readImmediateByte(): number {
        return this.mmu.getByte(this.read('PC') - 1);
    }

    private readImmediateWord(): number {
        return this.mmu.getWord(this.read('PC') - 2);
    }

    public read(type: RegisterType): number {
        return this[type].get();
    }

    private setByte(address: number, data: number) {
        this.mmu.setByte(address, data);
        const result = this.debugMemory(address, data);

        this.shouldPause = this.shouldPause || result;
    }

    private setWord(address: number, data: number) {
        this.mmu.setWord(address, data);
        const result = this.debugMemory(address, data);
        this.shouldPause = this.shouldPause || result;
    }

    private debugMemory(address: number, data: number): boolean {
        if (debugEnabled.printMemory) {
            if (this.memoryDebuggerConfig) {
                for (const bp of this.memoryDebuggerConfig.breakpoints) {
                    switch (bp.type) {
                        case 'ADDR':
                            if (address !== bp.value) {
                                continue;
                            }
                            break;
                        case 'VAL':
                            if (data !== bp.value) {
                                continue;
                            }
                            break;
                    }
                    this.memoryDebuggerConfig.debugger(address, data);
                    return bp.pasue === true;
                }
            }
        }
        return false;
    }

    private updatePC(length: number) {
        const result = this.read('PC') + length;
        this.PC.set(result);
    }

    private increment(type: RegisterType) {
        const val = this[type].get() + 1;
        this[type].set(val);
    }

    private decrement(type: RegisterType) {
        const val = this[type].get() - 1;
        this[type].set(val);
    }

    private pushStack(data: number) {
        // decrement SP twice for 2 bytes of data
        this.decrement('SP');
        this.decrement('SP');
        this.setWord(this.read('SP'), data);
    }

    private popStack(): number {
        const data = this.mmu.getWord(this.read('SP'));

        // increment SP twice for 2 bytes of data
        this.increment('SP');
        this.increment('SP');
        return data;
    }

    private halt(flag: boolean) {
        if (flag)
            console.warn('CPU HALT => ' + flag);
        this.haltFlag = flag;
    }

    private stop() {
        console.warn('CPU STOP');
        // TODO
    }

    private setInterrupts(flag: boolean) {
        this.interruptsMasterEnable = flag;
    }

    private performRST(address: RSTAddress) {
        this.pushStack(this.read('PC'));
        this.PC.set(address);
    }

    private debug(): boolean {
        if (debugEnabled.breakpoints) {
            if (this.debuggerConfig) {
                for (const bp of this.debuggerConfig.breakpoints) {
                    if (bp.type === 'PC') {
                        if (this.read('PC') !== bp.value) {
                            continue;
                        }
                    } else if (bp.type === 'OPCODE') {
                        if (this.fetchCode() !== bp.value) {
                            continue;
                        }
                    }
                    this.debuggerConfig.debugger(this, bp.type, bp.value);
                    return true;
                }
            }
        }
        return false;
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

                // Update the Flag Register
                this.setFlag('zero', def.setZero, zero);
                this.setFlag('subtract', def.setSubtract, subtract);
                this.setFlag('halfCarry', def.setHalfCarry, halfCarry);
                this.setFlag('carry', def.setCarry, carry);

                // Update the CPU clock
                if (cycles) {
                    return cycles;
                } else {
                    return def.clock_cycles[0];
                }
            };
        });
    }

    private setFlag(flag: 'zero' | 'subtract' | 'halfCarry' | 'carry', affection: FlagAffection, value?: boolean): void {
        if (affection === false) {
            return;
        }
        let flagValue: boolean;
        if (affection === true) {
            if (value === undefined) throw new Error('Expected Flag value but got none');
            flagValue = value;
        } else {
            flagValue = affection === 1;
        }
        this.F[flag] = flagValue;
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
            const result = ALU.add16(SP.get(), n.get());
            this.HL.set(result.result);

            return result;
        };
    }

    private buildPUSHInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected one operands when building [PUSH] Insturction:\n' + JSON.stringify(def, null, 4));
        const [source] = def.operands.map((operand) => this.parseOperator(operand));

        return () => {

            this.pushStack(source.get());

            return {}
        };
    }

    private buildPOPInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected one operands when building [PUSH] Insturction:\n' + JSON.stringify(def, null, 4));
        const [target] = def.operands.map((operand) => this.parseOperator(operand));

        return () => {

            target.set(this.popStack());

            return { zero: this.F.zero, subtract: this.F.subtract, halfCarry: this.F.halfCarry, carry: this.F.carry }
        };
    }

    private buildADDInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected two operands when building [ADD] Insturction:\n' + JSON.stringify(def, null, 4));
        const [target, source] = def.operands.map((operand) => this.parseOperator(operand));

        let addition: (a: number, b: number) => ALUResult;

        if (source.size === 2 || target.size === 2) {
            addition = ALU.add16;
        } else if (source.size === 1 && target.size === 1) {
            addition = ALU.add8;
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

        if (source.size === 2 || target.size === 2) {
            addition = ALU.add16;
        } else if (source.size === 1 && target.size === 1) {
            addition = ALU.add8;
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
        if (!def.operands) throw new Error('Expected one operands when building [OR] Insturction:\n' + JSON.stringify(def, null, 4));
        const [source] = def.operands.map((operand) => this.parseOperator(operand));
        return () => {

            const result = ALU.and(this.read('A'), source.get());
            this.A.set(result.result);

            return result;
        };
    }

    private buildORInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected one operands when building [OR] Insturction:\n' + JSON.stringify(def, null, 4));
        const [source] = def.operands.map((operand) => this.parseOperator(operand));
        return () => {

            const result = ALU.or(this.read('A'), source.get());
            this.A.set(result.result);

            return result;
        };
    }

    private buildXORInstruction = (def: Opcode): () => ExecutionResult => {
        if (!def.operands) throw new Error('Expected one operands when building [XOR] Insturction:\n' + JSON.stringify(def, null, 4));
        const [source] = def.operands.map((operand) => this.parseOperator(operand));
        return () => {

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
            let adjust = this.F.carry ? 0x60 : 0x00;
            if (this.F.halfCarry) {
                adjust |= 0x06;
            }
            if (!this.F.subtract) {
                if ((a & 0xf) > 0x9) {
                    adjust |= 0x06;
                }
                if (a > 0x99) {
                    adjust |= 0x60;
                }
                a = a + adjust;
            } else {
                a = a - adjust;
            }
            a &= 0xff;
            this.A.set(a);

            return { zero: a === 0, carry: adjust >= 0x60 };
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
            this.halt(true);
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

        const target = parseRSTAddress(def.operands[0]);

        return () => {
            this.performRST(target);
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
            this.log(true);
            const code = this.fetchCode(); // fetch
            const op = this.decodeToCBOp(code); // op
            const cycles = op(); // execute
            return { cycles: def.clock_cycles[0] + cycles }
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
                return this.toImmediateAddressMemoryOperator('a16');
            }
            if (mem === 'a8') {
                return this.toImmediateAddressMemoryOperator('a8');
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
        const getAddress = (): number => {
            let address = reg.get();
            if (reg.size() === 1) {
                address = 0xff00 | address;
            }
            return address;
        }
        const handleSign = () => {
            if (!sign) return;
            if (sign === '+') {
                this.increment(type);
            } else if (sign === '-') {
                this.decrement(type);
            }
        };
        return {
            size: 1,
            set: (byte: number) => {
                this.setByte(getAddress(), byte);
                handleSign();
            },
            get: () => {
                const val = this.mmu.getByte(getAddress());
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
            case 'a16':
                return {
                    size: 2,
                    set: (byte: number) => { throw new Error('Unsupported operation'); },
                    get: () => { return this.readImmediateWord(); }
                };
        }
    }

    private toImmediateAddressMemoryOperator(type: 'a8' | 'a16'): Operator<number> {
        switch (type) {
            case 'a8':
                return {
                    size: 1,
                    set: (byte: number) => { this.setByte(this.readImmediateByte() | 0xff00, byte) },
                    get: () => { return this.mmu.getByte(this.readImmediateByte() | 0xff00); }
                };
            case 'a16':
                return {
                    size: 1,
                    set: (byte: number) => { this.setByte(this.readImmediateWord(), byte) },
                    get: () => { return this.mmu.getByte(this.readImmediateWord()); }
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
                return reg.get();
            }
        };
    }

    public isHalt(): boolean {
        return this.haltFlag;
    }

    public isInterrupsEnabled(): boolean {
        return this.interruptsMasterEnable;
    }

}

type OpcodeExecutor = (() => number);

type InstructionSet = (OpcodeExecutor | null)[];

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

interface Breakpoint {
    type: 'PC' | 'OPCODE',
    value: number
};

type CPUDebugger = (cpu: CPU, type: 'PC' | 'OPCODE', value: number) => void;

export interface CPUDebuggerConfig {
    breakpoints: Breakpoint[],
    debugger: CPUDebugger
}