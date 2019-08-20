export interface Opcode {
    label: string,
    operation: Operation,
    operands?: string[],
    opcode_length: number,
    clock_cycles: number[],
    setZero: FlagAffection,
    setSubtract: FlagAffection,
    setHalfCarry: FlagAffection,
    setCarry: FlagAffection,
}

// 45 operations
export type Operation =
    "NOP" | "LD" | "LDHL" | "INC" | "DEC" | "RLCA" | "ADD" | "RRCA" | "STOP" |
    "RLA" | "JR" | "RRA" | "DAA" | "CPL" | "SCF" | "CCF" | "HALT" |
    "ADC" | "SUB" | "SBC" | "AND" | "XOR" | "OR" | "CP" | "RET" |
    "POP" | "JP" | "CALL" | "PUSH" | "RST" | "PREFIX" | "RETI" | "LDH" |
    "DI" | "EI" | "RLC" | "RRC" | "RL" | "RR" | "SLA" | "SRA" |
    "SWAP" | "SRL" | "BIT" | "RES" | "SET";

export type FlagAffection = boolean | 1 | 0;

export const OPCODES: Array<Opcode | null> = [
    {
        "label": "NOP",
        "operation": "NOP",
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD BC,d16",
        "operation": "LD",
        "operands": [
            "BC",
            "d16"
        ],
        "opcode_length": 3,
        "clock_cycles": [
            12
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD (BC),A",
        "operation": "LD",
        "operands": [
            "(BC)",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "INC BC",
        "operation": "INC",
        "operands": [
            "BC"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "INC B",
        "operation": "INC",
        "operands": [
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": false
    },
    {
        "label": "DEC B",
        "operation": "DEC",
        "operands": [
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": false
    },
    {
        "label": "LD B,d8",
        "operation": "LD",
        "operands": [
            "B",
            "d8"
        ],
        "opcode_length": 2,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RLCA",
        "operation": "RLCA",
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": 0,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "LD (a16),SP",
        "operation": "LD",
        "operands": [
            "(a16)",
            "SP"
        ],
        "opcode_length": 3,
        "clock_cycles": [
            20
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "ADD HL,BC",
        "operation": "ADD",
        "operands": [
            "HL",
            "BC"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "LD A,(BC)",
        "operation": "LD",
        "operands": [
            "A",
            "(BC)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "DEC BC",
        "operation": "DEC",
        "operands": [
            "BC"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "INC C",
        "operation": "INC",
        "operands": [
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": false
    },
    {
        "label": "DEC C",
        "operation": "DEC",
        "operands": [
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": false
    },
    {
        "label": "LD C,d8",
        "operation": "LD",
        "operands": [
            "C",
            "d8"
        ],
        "opcode_length": 2,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RRCA",
        "operation": "RRCA",
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": 0,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "STOP 0",
        "operation": "STOP",
        "operands": [
            "0"
        ],
        "opcode_length": 2,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD DE,d16",
        "operation": "LD",
        "operands": [
            "DE",
            "d16"
        ],
        "opcode_length": 3,
        "clock_cycles": [
            12
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD (DE),A",
        "operation": "LD",
        "operands": [
            "(DE)",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "INC DE",
        "operation": "INC",
        "operands": [
            "DE"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "INC D",
        "operation": "INC",
        "operands": [
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": false
    },
    {
        "label": "DEC D",
        "operation": "DEC",
        "operands": [
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": false
    },
    {
        "label": "LD D,d8",
        "operation": "LD",
        "operands": [
            "D",
            "d8"
        ],
        "opcode_length": 2,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RLA",
        "operation": "RLA",
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": 0,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "JR r8",
        "operation": "JR",
        "operands": [
            "r8"
        ],
        "opcode_length": 2,
        "clock_cycles": [
            12
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "ADD HL,DE",
        "operation": "ADD",
        "operands": [
            "HL",
            "DE"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "LD A,(DE)",
        "operation": "LD",
        "operands": [
            "A",
            "(DE)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "DEC DE",
        "operation": "DEC",
        "operands": [
            "DE"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "INC E",
        "operation": "INC",
        "operands": [
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": false
    },
    {
        "label": "DEC E",
        "operation": "DEC",
        "operands": [
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": false
    },
    {
        "label": "LD E,d8",
        "operation": "LD",
        "operands": [
            "E",
            "d8"
        ],
        "opcode_length": 2,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RRA",
        "operation": "RRA",
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": 0,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "JR NZ,r8",
        "operation": "JR",
        "operands": [
            "NZ",
            "r8"
        ],
        "opcode_length": 2,
        "clock_cycles": [
            12,
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD HL,d16",
        "operation": "LD",
        "operands": [
            "HL",
            "d16"
        ],
        "opcode_length": 3,
        "clock_cycles": [
            12
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD (HL+),A",
        "operation": "LD",
        "operands": [
            "(HL+)",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "INC HL",
        "operation": "INC",
        "operands": [
            "HL"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "INC H",
        "operation": "INC",
        "operands": [
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": false
    },
    {
        "label": "DEC H",
        "operation": "DEC",
        "operands": [
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": false
    },
    {
        "label": "LD H,d8",
        "operation": "LD",
        "operands": [
            "H",
            "d8"
        ],
        "opcode_length": 2,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "DAA",
        "operation": "DAA",
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": false,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "JR Z,r8",
        "operation": "JR",
        "operands": [
            "Z",
            "r8"
        ],
        "opcode_length": 2,
        "clock_cycles": [
            12,
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "ADD HL,HL",
        "operation": "ADD",
        "operands": [
            "HL",
            "HL"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "LD A,(HL+)",
        "operation": "LD",
        "operands": [
            "A",
            "(HL+)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "DEC HL",
        "operation": "DEC",
        "operands": [
            "HL"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "INC L",
        "operation": "INC",
        "operands": [
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": false
    },
    {
        "label": "DEC L",
        "operation": "DEC",
        "operands": [
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": false
    },
    {
        "label": "LD L,d8",
        "operation": "LD",
        "operands": [
            "L",
            "d8"
        ],
        "opcode_length": 2,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "CPL",
        "operation": "CPL",
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": 1,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "JR NC,r8",
        "operation": "JR",
        "operands": [
            "NC",
            "r8"
        ],
        "opcode_length": 2,
        "clock_cycles": [
            12,
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD SP,d16",
        "operation": "LD",
        "operands": [
            "SP",
            "d16"
        ],
        "opcode_length": 3,
        "clock_cycles": [
            12
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD (HL-),A",
        "operation": "LD",
        "operands": [
            "(HL-)",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "INC SP",
        "operation": "INC",
        "operands": [
            "SP"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "INC (HL)",
        "operation": "INC",
        "operands": [
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            12
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": false
    },
    {
        "label": "DEC (HL)",
        "operation": "DEC",
        "operands": [
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            12
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": false
    },
    {
        "label": "LD (HL),d8",
        "operation": "LD",
        "operands": [
            "(HL)",
            "d8"
        ],
        "opcode_length": 2,
        "clock_cycles": [
            12
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SCF",
        "operation": "SCF",
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": 1
    },
    {
        "label": "JR C,r8",
        "operation": "JR",
        "operands": [
            "C",
            "r8"
        ],
        "opcode_length": 2,
        "clock_cycles": [
            12,
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "ADD HL,SP",
        "operation": "ADD",
        "operands": [
            "HL",
            "SP"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "LD A,(HL-)",
        "operation": "LD",
        "operands": [
            "A",
            "(HL-)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "DEC SP",
        "operation": "DEC",
        "operands": [
            "SP"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "INC A",
        "operation": "INC",
        "operands": [
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": false
    },
    {
        "label": "DEC A",
        "operation": "DEC",
        "operands": [
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": false
    },
    {
        "label": "LD A,d8",
        "operation": "LD",
        "operands": [
            "A",
            "d8"
        ],
        "opcode_length": 2,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "CCF",
        "operation": "CCF",
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "LD B,B",
        "operation": "LD",
        "operands": [
            "B",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD B,C",
        "operation": "LD",
        "operands": [
            "B",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD B,D",
        "operation": "LD",
        "operands": [
            "B",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD B,E",
        "operation": "LD",
        "operands": [
            "B",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD B,H",
        "operation": "LD",
        "operands": [
            "B",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD B,L",
        "operation": "LD",
        "operands": [
            "B",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD B,(HL)",
        "operation": "LD",
        "operands": [
            "B",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD B,A",
        "operation": "LD",
        "operands": [
            "B",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD C,B",
        "operation": "LD",
        "operands": [
            "C",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD C,C",
        "operation": "LD",
        "operands": [
            "C",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD C,D",
        "operation": "LD",
        "operands": [
            "C",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD C,E",
        "operation": "LD",
        "operands": [
            "C",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD C,H",
        "operation": "LD",
        "operands": [
            "C",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD C,L",
        "operation": "LD",
        "operands": [
            "C",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD C,(HL)",
        "operation": "LD",
        "operands": [
            "C",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD C,A",
        "operation": "LD",
        "operands": [
            "C",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD D,B",
        "operation": "LD",
        "operands": [
            "D",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD D,C",
        "operation": "LD",
        "operands": [
            "D",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD D,D",
        "operation": "LD",
        "operands": [
            "D",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD D,E",
        "operation": "LD",
        "operands": [
            "D",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD D,H",
        "operation": "LD",
        "operands": [
            "D",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD D,L",
        "operation": "LD",
        "operands": [
            "D",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD D,(HL)",
        "operation": "LD",
        "operands": [
            "D",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD D,A",
        "operation": "LD",
        "operands": [
            "D",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD E,B",
        "operation": "LD",
        "operands": [
            "E",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD E,C",
        "operation": "LD",
        "operands": [
            "E",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD E,D",
        "operation": "LD",
        "operands": [
            "E",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD E,E",
        "operation": "LD",
        "operands": [
            "E",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD E,H",
        "operation": "LD",
        "operands": [
            "E",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD E,L",
        "operation": "LD",
        "operands": [
            "E",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD E,(HL)",
        "operation": "LD",
        "operands": [
            "E",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD E,A",
        "operation": "LD",
        "operands": [
            "E",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD H,B",
        "operation": "LD",
        "operands": [
            "H",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD H,C",
        "operation": "LD",
        "operands": [
            "H",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD H,D",
        "operation": "LD",
        "operands": [
            "H",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD H,E",
        "operation": "LD",
        "operands": [
            "H",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD H,H",
        "operation": "LD",
        "operands": [
            "H",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD H,L",
        "operation": "LD",
        "operands": [
            "H",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD H,(HL)",
        "operation": "LD",
        "operands": [
            "H",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD H,A",
        "operation": "LD",
        "operands": [
            "H",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD L,B",
        "operation": "LD",
        "operands": [
            "L",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD L,C",
        "operation": "LD",
        "operands": [
            "L",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD L,D",
        "operation": "LD",
        "operands": [
            "L",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD L,E",
        "operation": "LD",
        "operands": [
            "L",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD L,H",
        "operation": "LD",
        "operands": [
            "L",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD L,L",
        "operation": "LD",
        "operands": [
            "L",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD L,(HL)",
        "operation": "LD",
        "operands": [
            "L",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD L,A",
        "operation": "LD",
        "operands": [
            "L",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD (HL),B",
        "operation": "LD",
        "operands": [
            "(HL)",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD (HL),C",
        "operation": "LD",
        "operands": [
            "(HL)",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD (HL),D",
        "operation": "LD",
        "operands": [
            "(HL)",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD (HL),E",
        "operation": "LD",
        "operands": [
            "(HL)",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD (HL),H",
        "operation": "LD",
        "operands": [
            "(HL)",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD (HL),L",
        "operation": "LD",
        "operands": [
            "(HL)",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "HALT",
        "operation": "HALT",
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD (HL),A",
        "operation": "LD",
        "operands": [
            "(HL)",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD A,B",
        "operation": "LD",
        "operands": [
            "A",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD A,C",
        "operation": "LD",
        "operands": [
            "A",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD A,D",
        "operation": "LD",
        "operands": [
            "A",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD A,E",
        "operation": "LD",
        "operands": [
            "A",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD A,H",
        "operation": "LD",
        "operands": [
            "A",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD A,L",
        "operation": "LD",
        "operands": [
            "A",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD A,(HL)",
        "operation": "LD",
        "operands": [
            "A",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD A,A",
        "operation": "LD",
        "operands": [
            "A",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "ADD A,B",
        "operation": "ADD",
        "operands": [
            "A",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "ADD A,C",
        "operation": "ADD",
        "operands": [
            "A",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "ADD A,D",
        "operation": "ADD",
        "operands": [
            "A",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "ADD A,E",
        "operation": "ADD",
        "operands": [
            "A",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "ADD A,H",
        "operation": "ADD",
        "operands": [
            "A",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "ADD A,L",
        "operation": "ADD",
        "operands": [
            "A",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "ADD A,(HL)",
        "operation": "ADD",
        "operands": [
            "A",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "ADD A,A",
        "operation": "ADD",
        "operands": [
            "A",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "ADC A,B",
        "operation": "ADC",
        "operands": [
            "A",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "ADC A,C",
        "operation": "ADC",
        "operands": [
            "A",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "ADC A,D",
        "operation": "ADC",
        "operands": [
            "A",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "ADC A,E",
        "operation": "ADC",
        "operands": [
            "A",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "ADC A,H",
        "operation": "ADC",
        "operands": [
            "A",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "ADC A,L",
        "operation": "ADC",
        "operands": [
            "A",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "ADC A,(HL)",
        "operation": "ADC",
        "operands": [
            "A",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "ADC A,A",
        "operation": "ADC",
        "operands": [
            "A",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "SUB B",
        "operation": "SUB",
        "operands": [
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "SUB C",
        "operation": "SUB",
        "operands": [
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "SUB D",
        "operation": "SUB",
        "operands": [
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "SUB E",
        "operation": "SUB",
        "operands": [
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "SUB H",
        "operation": "SUB",
        "operands": [
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "SUB L",
        "operation": "SUB",
        "operands": [
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "SUB (HL)",
        "operation": "SUB",
        "operands": [
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "SUB A",
        "operation": "SUB",
        "operands": [
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "SBC A,B",
        "operation": "SBC",
        "operands": [
            "A",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "SBC A,C",
        "operation": "SBC",
        "operands": [
            "A",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "SBC A,D",
        "operation": "SBC",
        "operands": [
            "A",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "SBC A,E",
        "operation": "SBC",
        "operands": [
            "A",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "SBC A,H",
        "operation": "SBC",
        "operands": [
            "A",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "SBC A,L",
        "operation": "SBC",
        "operands": [
            "A",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "SBC A,(HL)",
        "operation": "SBC",
        "operands": [
            "A",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "SBC A,A",
        "operation": "SBC",
        "operands": [
            "A",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "AND B",
        "operation": "AND",
        "operands": [
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": 0
    },
    {
        "label": "AND C",
        "operation": "AND",
        "operands": [
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": 0
    },
    {
        "label": "AND D",
        "operation": "AND",
        "operands": [
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": 0
    },
    {
        "label": "AND E",
        "operation": "AND",
        "operands": [
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": 0
    },
    {
        "label": "AND H",
        "operation": "AND",
        "operands": [
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": 0
    },
    {
        "label": "AND L",
        "operation": "AND",
        "operands": [
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": 0
    },
    {
        "label": "AND (HL)",
        "operation": "AND",
        "operands": [
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": 0
    },
    {
        "label": "AND A",
        "operation": "AND",
        "operands": [
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": 0
    },
    {
        "label": "XOR B",
        "operation": "XOR",
        "operands": [
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": 0
    },
    {
        "label": "XOR C",
        "operation": "XOR",
        "operands": [
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": 0
    },
    {
        "label": "XOR D",
        "operation": "XOR",
        "operands": [
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": 0
    },
    {
        "label": "XOR E",
        "operation": "XOR",
        "operands": [
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": 0
    },
    {
        "label": "XOR H",
        "operation": "XOR",
        "operands": [
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": 0
    },
    {
        "label": "XOR L",
        "operation": "XOR",
        "operands": [
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": 0
    },
    {
        "label": "XOR (HL)",
        "operation": "XOR",
        "operands": [
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": 0
    },
    {
        "label": "XOR A",
        "operation": "XOR",
        "operands": [
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": 0
    },
    {
        "label": "OR B",
        "operation": "OR",
        "operands": [
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": 0
    },
    {
        "label": "OR C",
        "operation": "OR",
        "operands": [
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": 0
    },
    {
        "label": "OR D",
        "operation": "OR",
        "operands": [
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": 0
    },
    {
        "label": "OR E",
        "operation": "OR",
        "operands": [
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": 0
    },
    {
        "label": "OR H",
        "operation": "OR",
        "operands": [
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": 0
    },
    {
        "label": "OR L",
        "operation": "OR",
        "operands": [
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": 0
    },
    {
        "label": "OR (HL)",
        "operation": "OR",
        "operands": [
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": 0
    },
    {
        "label": "OR A",
        "operation": "OR",
        "operands": [
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": 0
    },
    {
        "label": "CP B",
        "operation": "CP",
        "operands": [
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "CP C",
        "operation": "CP",
        "operands": [
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "CP D",
        "operation": "CP",
        "operands": [
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "CP E",
        "operation": "CP",
        "operands": [
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "CP H",
        "operation": "CP",
        "operands": [
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "CP L",
        "operation": "CP",
        "operands": [
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "CP (HL)",
        "operation": "CP",
        "operands": [
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "CP A",
        "operation": "CP",
        "operands": [
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "RET NZ",
        "operation": "RET",
        "operands": [
            "NZ"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            20,
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "POP BC",
        "operation": "POP",
        "operands": [
            "BC"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            12
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "JP NZ,a16",
        "operation": "JP",
        "operands": [
            "NZ",
            "a16"
        ],
        "opcode_length": 3,
        "clock_cycles": [
            16,
            12
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "JP a16",
        "operation": "JP",
        "operands": [
            "a16"
        ],
        "opcode_length": 3,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "CALL NZ,a16",
        "operation": "CALL",
        "operands": [
            "NZ",
            "a16"
        ],
        "opcode_length": 3,
        "clock_cycles": [
            24,
            12
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "PUSH BC",
        "operation": "PUSH",
        "operands": [
            "BC"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "ADD A,d8",
        "operation": "ADD",
        "operands": [
            "A",
            "d8"
        ],
        "opcode_length": 2,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "RST 00H",
        "operation": "RST",
        "operands": [
            "00H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RET Z",
        "operation": "RET",
        "operands": [
            "Z"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            20,
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RET",
        "operation": "RET",
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "JP Z,a16",
        "operation": "JP",
        "operands": [
            "Z",
            "a16"
        ],
        "opcode_length": 3,
        "clock_cycles": [
            16,
            12
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "PREFIX CB",
        "operation": "PREFIX",
        "operands": [
            "CB"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "CALL Z,a16",
        "operation": "CALL",
        "operands": [
            "Z",
            "a16"
        ],
        "opcode_length": 3,
        "clock_cycles": [
            24,
            12
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "CALL a16",
        "operation": "CALL",
        "operands": [
            "a16"
        ],
        "opcode_length": 3,
        "clock_cycles": [
            24
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "ADC A,d8",
        "operation": "ADC",
        "operands": [
            "A",
            "d8"
        ],
        "opcode_length": 2,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "RST 08H",
        "operation": "RST",
        "operands": [
            "08H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RET NC",
        "operation": "RET",
        "operands": [
            "NC"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            20,
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "POP DE",
        "operation": "POP",
        "operands": [
            "DE"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            12
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "JP NC,a16",
        "operation": "JP",
        "operands": [
            "NC",
            "a16"
        ],
        "opcode_length": 3,
        "clock_cycles": [
            16,
            12
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    null,
    {
        "label": "CALL NC,a16",
        "operation": "CALL",
        "operands": [
            "NC",
            "a16"
        ],
        "opcode_length": 3,
        "clock_cycles": [
            24,
            12
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "PUSH DE",
        "operation": "PUSH",
        "operands": [
            "DE"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SUB d8",
        "operation": "SUB",
        "operands": [
            "d8"
        ],
        "opcode_length": 2,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "RST 10H",
        "operation": "RST",
        "operands": [
            "10H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RET C",
        "operation": "RET",
        "operands": [
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            20,
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RETI",
        "operation": "RETI",
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "JP C,a16",
        "operation": "JP",
        "operands": [
            "C",
            "a16"
        ],
        "opcode_length": 3,
        "clock_cycles": [
            16,
            12
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    null,
    {
        "label": "CALL C,a16",
        "operation": "CALL",
        "operands": [
            "C",
            "a16"
        ],
        "opcode_length": 3,
        "clock_cycles": [
            24,
            12
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    null,
    {
        "label": "SBC A,d8",
        "operation": "SBC",
        "operands": [
            "A",
            "d8"
        ],
        "opcode_length": 2,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "RST 18H",
        "operation": "RST",
        "operands": [
            "18H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LDH (a8),A",
        "operation": "LDH",
        "operands": [
            "(a8)",
            "A"
        ],
        "opcode_length": 2,
        "clock_cycles": [
            12
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "POP HL",
        "operation": "POP",
        "operands": [
            "HL"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            12
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD (C),A",
        "operation": "LD",
        "operands": [
            "(C)",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    null,
    null,
    {
        "label": "PUSH HL",
        "operation": "PUSH",
        "operands": [
            "HL"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "AND d8",
        "operation": "AND",
        "operands": [
            "d8"
        ],
        "opcode_length": 2,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": 0
    },
    {
        "label": "RST 20H",
        "operation": "RST",
        "operands": [
            "20H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "ADD SP,r8",
        "operation": "ADD",
        "operands": [
            "SP",
            "r8"
        ],
        "opcode_length": 2,
        "clock_cycles": [
            16
        ],
        "setZero": 0,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "JP (HL)",
        "operation": "JP",
        "operands": [
            "HL"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD (a16),A",
        "operation": "LD",
        "operands": [
            "(a16)",
            "A"
        ],
        "opcode_length": 3,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    null,
    null,
    null,
    {
        "label": "XOR d8",
        "operation": "XOR",
        "operands": [
            "d8"
        ],
        "opcode_length": 2,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": 0
    },
    {
        "label": "RST 28H",
        "operation": "RST",
        "operands": [
            "28H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LDH A,(a8)",
        "operation": "LDH",
        "operands": [
            "A",
            "(a8)"
        ],
        "opcode_length": 2,
        "clock_cycles": [
            12
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "POP AF",
        "operation": "POP",
        "operands": [
            "AF"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            12
        ],
        "setZero": true,
        "setSubtract": true,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "LD A,(C)",
        "operation": "LD",
        "operands": [
            "A",
            "(C)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "DI",
        "operation": "DI",
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    null,
    {
        "label": "PUSH AF",
        "operation": "PUSH",
        "operands": [
            "AF"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "OR d8",
        "operation": "OR",
        "operands": [
            "d8"
        ],
        "opcode_length": 2,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": 0
    },
    {
        "label": "RST 30H",
        "operation": "RST",
        "operands": [
            "30H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LDHL SP,r8",
        "operation": "LDHL",
        "operands": [
            "SP",
            "r8"
        ],
        "opcode_length": 2,
        "clock_cycles": [
            12
        ],
        "setZero": 0,
        "setSubtract": 0,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "LD SP,HL",
        "operation": "LD",
        "operands": [
            "SP",
            "HL"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "LD A,(a16)",
        "operation": "LD",
        "operands": [
            "A",
            "(a16)"
        ],
        "opcode_length": 3,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "EI",
        "operation": "EI",
        "opcode_length": 1,
        "clock_cycles": [
            4
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    null,
    null,
    {
        "label": "CP d8",
        "operation": "CP",
        "operands": [
            "d8"
        ],
        "opcode_length": 2,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 1,
        "setHalfCarry": true,
        "setCarry": true
    },
    {
        "label": "RST 38H",
        "operation": "RST",
        "operands": [
            "38H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    }
];

export const CB_OPCODES: Array<Opcode | null> = [
    {
        "label": "RLC B",
        "operation": "RLC",
        "operands": [
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RLC C",
        "operation": "RLC",
        "operands": [
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RLC D",
        "operation": "RLC",
        "operands": [
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RLC E",
        "operation": "RLC",
        "operands": [
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RLC H",
        "operation": "RLC",
        "operands": [
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RLC L",
        "operation": "RLC",
        "operands": [
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RLC (HL)",
        "operation": "RLC",
        "operands": [
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RLC A",
        "operation": "RLC",
        "operands": [
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RRC B",
        "operation": "RRC",
        "operands": [
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RRC C",
        "operation": "RRC",
        "operands": [
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RRC D",
        "operation": "RRC",
        "operands": [
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RRC E",
        "operation": "RRC",
        "operands": [
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RRC H",
        "operation": "RRC",
        "operands": [
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RRC L",
        "operation": "RRC",
        "operands": [
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RRC (HL)",
        "operation": "RRC",
        "operands": [
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RRC A",
        "operation": "RRC",
        "operands": [
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RL B",
        "operation": "RL",
        "operands": [
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RL C",
        "operation": "RL",
        "operands": [
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RL D",
        "operation": "RL",
        "operands": [
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RL E",
        "operation": "RL",
        "operands": [
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RL H",
        "operation": "RL",
        "operands": [
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RL L",
        "operation": "RL",
        "operands": [
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RL (HL)",
        "operation": "RL",
        "operands": [
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RL A",
        "operation": "RL",
        "operands": [
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RR B",
        "operation": "RR",
        "operands": [
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RR C",
        "operation": "RR",
        "operands": [
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RR D",
        "operation": "RR",
        "operands": [
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RR E",
        "operation": "RR",
        "operands": [
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RR H",
        "operation": "RR",
        "operands": [
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RR L",
        "operation": "RR",
        "operands": [
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RR (HL)",
        "operation": "RR",
        "operands": [
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "RR A",
        "operation": "RR",
        "operands": [
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "SLA B",
        "operation": "SLA",
        "operands": [
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "SLA C",
        "operation": "SLA",
        "operands": [
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "SLA D",
        "operation": "SLA",
        "operands": [
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "SLA E",
        "operation": "SLA",
        "operands": [
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "SLA H",
        "operation": "SLA",
        "operands": [
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "SLA L",
        "operation": "SLA",
        "operands": [
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "SLA (HL)",
        "operation": "SLA",
        "operands": [
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "SLA A",
        "operation": "SLA",
        "operands": [
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "SRA B",
        "operation": "SRA",
        "operands": [
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "SRA C",
        "operation": "SRA",
        "operands": [
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "SRA D",
        "operation": "SRA",
        "operands": [
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "SRA E",
        "operation": "SRA",
        "operands": [
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "SRA H",
        "operation": "SRA",
        "operands": [
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "SRA L",
        "operation": "SRA",
        "operands": [
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "SRA (HL)",
        "operation": "SRA",
        "operands": [
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "SRA A",
        "operation": "SRA",
        "operands": [
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "SWAP B",
        "operation": "SWAP",
        "operands": [
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": 0
    },
    {
        "label": "SWAP C",
        "operation": "SWAP",
        "operands": [
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": 0
    },
    {
        "label": "SWAP D",
        "operation": "SWAP",
        "operands": [
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": 0
    },
    {
        "label": "SWAP E",
        "operation": "SWAP",
        "operands": [
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": 0
    },
    {
        "label": "SWAP H",
        "operation": "SWAP",
        "operands": [
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": 0
    },
    {
        "label": "SWAP L",
        "operation": "SWAP",
        "operands": [
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": 0
    },
    {
        "label": "SWAP (HL)",
        "operation": "SWAP",
        "operands": [
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": 0
    },
    {
        "label": "SWAP A",
        "operation": "SWAP",
        "operands": [
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": 0
    },
    {
        "label": "SRL B",
        "operation": "SRL",
        "operands": [
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "SRL C",
        "operation": "SRL",
        "operands": [
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "SRL D",
        "operation": "SRL",
        "operands": [
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "SRL E",
        "operation": "SRL",
        "operands": [
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "SRL H",
        "operation": "SRL",
        "operands": [
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "SRL L",
        "operation": "SRL",
        "operands": [
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "SRL (HL)",
        "operation": "SRL",
        "operands": [
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "SRL A",
        "operation": "SRL",
        "operands": [
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 0,
        "setCarry": true
    },
    {
        "label": "BIT 0,B",
        "operation": "BIT",
        "operands": [
            "0",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 0,C",
        "operation": "BIT",
        "operands": [
            "0",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 0,D",
        "operation": "BIT",
        "operands": [
            "0",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 0,E",
        "operation": "BIT",
        "operands": [
            "0",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 0,H",
        "operation": "BIT",
        "operands": [
            "0",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 0,L",
        "operation": "BIT",
        "operands": [
            "0",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 0,(HL)",
        "operation": "BIT",
        "operands": [
            "0",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 0,A",
        "operation": "BIT",
        "operands": [
            "0",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 1,B",
        "operation": "BIT",
        "operands": [
            "1",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 1,C",
        "operation": "BIT",
        "operands": [
            "1",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 1,D",
        "operation": "BIT",
        "operands": [
            "1",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 1,E",
        "operation": "BIT",
        "operands": [
            "1",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 1,H",
        "operation": "BIT",
        "operands": [
            "1",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 1,L",
        "operation": "BIT",
        "operands": [
            "1",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 1,(HL)",
        "operation": "BIT",
        "operands": [
            "1",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 1,A",
        "operation": "BIT",
        "operands": [
            "1",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 2,B",
        "operation": "BIT",
        "operands": [
            "2",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 2,C",
        "operation": "BIT",
        "operands": [
            "2",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 2,D",
        "operation": "BIT",
        "operands": [
            "2",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 2,E",
        "operation": "BIT",
        "operands": [
            "2",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 2,H",
        "operation": "BIT",
        "operands": [
            "2",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 2,L",
        "operation": "BIT",
        "operands": [
            "2",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 2,(HL)",
        "operation": "BIT",
        "operands": [
            "2",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 2,A",
        "operation": "BIT",
        "operands": [
            "2",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 3,B",
        "operation": "BIT",
        "operands": [
            "3",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 3,C",
        "operation": "BIT",
        "operands": [
            "3",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 3,D",
        "operation": "BIT",
        "operands": [
            "3",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 3,E",
        "operation": "BIT",
        "operands": [
            "3",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 3,H",
        "operation": "BIT",
        "operands": [
            "3",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 3,L",
        "operation": "BIT",
        "operands": [
            "3",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 3,(HL)",
        "operation": "BIT",
        "operands": [
            "3",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 3,A",
        "operation": "BIT",
        "operands": [
            "3",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 4,B",
        "operation": "BIT",
        "operands": [
            "4",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 4,C",
        "operation": "BIT",
        "operands": [
            "4",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 4,D",
        "operation": "BIT",
        "operands": [
            "4",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 4,E",
        "operation": "BIT",
        "operands": [
            "4",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 4,H",
        "operation": "BIT",
        "operands": [
            "4",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 4,L",
        "operation": "BIT",
        "operands": [
            "4",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 4,(HL)",
        "operation": "BIT",
        "operands": [
            "4",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 4,A",
        "operation": "BIT",
        "operands": [
            "4",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 5,B",
        "operation": "BIT",
        "operands": [
            "5",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 5,C",
        "operation": "BIT",
        "operands": [
            "5",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 5,D",
        "operation": "BIT",
        "operands": [
            "5",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 5,E",
        "operation": "BIT",
        "operands": [
            "5",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 5,H",
        "operation": "BIT",
        "operands": [
            "5",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 5,L",
        "operation": "BIT",
        "operands": [
            "5",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 5,(HL)",
        "operation": "BIT",
        "operands": [
            "5",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 5,A",
        "operation": "BIT",
        "operands": [
            "5",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 6,B",
        "operation": "BIT",
        "operands": [
            "6",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 6,C",
        "operation": "BIT",
        "operands": [
            "6",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 6,D",
        "operation": "BIT",
        "operands": [
            "6",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 6,E",
        "operation": "BIT",
        "operands": [
            "6",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 6,H",
        "operation": "BIT",
        "operands": [
            "6",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 6,L",
        "operation": "BIT",
        "operands": [
            "6",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 6,(HL)",
        "operation": "BIT",
        "operands": [
            "6",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 6,A",
        "operation": "BIT",
        "operands": [
            "6",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 7,B",
        "operation": "BIT",
        "operands": [
            "7",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 7,C",
        "operation": "BIT",
        "operands": [
            "7",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 7,D",
        "operation": "BIT",
        "operands": [
            "7",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 7,E",
        "operation": "BIT",
        "operands": [
            "7",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 7,H",
        "operation": "BIT",
        "operands": [
            "7",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 7,L",
        "operation": "BIT",
        "operands": [
            "7",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 7,(HL)",
        "operation": "BIT",
        "operands": [
            "7",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "BIT 7,A",
        "operation": "BIT",
        "operands": [
            "7",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": true,
        "setSubtract": 0,
        "setHalfCarry": 1,
        "setCarry": false
    },
    {
        "label": "RES 0,B",
        "operation": "RES",
        "operands": [
            "0",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 0,C",
        "operation": "RES",
        "operands": [
            "0",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 0,D",
        "operation": "RES",
        "operands": [
            "0",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 0,E",
        "operation": "RES",
        "operands": [
            "0",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 0,H",
        "operation": "RES",
        "operands": [
            "0",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 0,L",
        "operation": "RES",
        "operands": [
            "0",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 0,(HL)",
        "operation": "RES",
        "operands": [
            "0",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 0,A",
        "operation": "RES",
        "operands": [
            "0",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 1,B",
        "operation": "RES",
        "operands": [
            "1",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 1,C",
        "operation": "RES",
        "operands": [
            "1",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 1,D",
        "operation": "RES",
        "operands": [
            "1",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 1,E",
        "operation": "RES",
        "operands": [
            "1",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 1,H",
        "operation": "RES",
        "operands": [
            "1",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 1,L",
        "operation": "RES",
        "operands": [
            "1",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 1,(HL)",
        "operation": "RES",
        "operands": [
            "1",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 1,A",
        "operation": "RES",
        "operands": [
            "1",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 2,B",
        "operation": "RES",
        "operands": [
            "2",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 2,C",
        "operation": "RES",
        "operands": [
            "2",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 2,D",
        "operation": "RES",
        "operands": [
            "2",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 2,E",
        "operation": "RES",
        "operands": [
            "2",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 2,H",
        "operation": "RES",
        "operands": [
            "2",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 2,L",
        "operation": "RES",
        "operands": [
            "2",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 2,(HL)",
        "operation": "RES",
        "operands": [
            "2",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 2,A",
        "operation": "RES",
        "operands": [
            "2",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 3,B",
        "operation": "RES",
        "operands": [
            "3",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 3,C",
        "operation": "RES",
        "operands": [
            "3",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 3,D",
        "operation": "RES",
        "operands": [
            "3",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 3,E",
        "operation": "RES",
        "operands": [
            "3",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 3,H",
        "operation": "RES",
        "operands": [
            "3",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 3,L",
        "operation": "RES",
        "operands": [
            "3",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 3,(HL)",
        "operation": "RES",
        "operands": [
            "3",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 3,A",
        "operation": "RES",
        "operands": [
            "3",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 4,B",
        "operation": "RES",
        "operands": [
            "4",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 4,C",
        "operation": "RES",
        "operands": [
            "4",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 4,D",
        "operation": "RES",
        "operands": [
            "4",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 4,E",
        "operation": "RES",
        "operands": [
            "4",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 4,H",
        "operation": "RES",
        "operands": [
            "4",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 4,L",
        "operation": "RES",
        "operands": [
            "4",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 4,(HL)",
        "operation": "RES",
        "operands": [
            "4",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 4,A",
        "operation": "RES",
        "operands": [
            "4",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 5,B",
        "operation": "RES",
        "operands": [
            "5",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 5,C",
        "operation": "RES",
        "operands": [
            "5",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 5,D",
        "operation": "RES",
        "operands": [
            "5",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 5,E",
        "operation": "RES",
        "operands": [
            "5",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 5,H",
        "operation": "RES",
        "operands": [
            "5",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 5,L",
        "operation": "RES",
        "operands": [
            "5",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 5,(HL)",
        "operation": "RES",
        "operands": [
            "5",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 5,A",
        "operation": "RES",
        "operands": [
            "5",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 6,B",
        "operation": "RES",
        "operands": [
            "6",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 6,C",
        "operation": "RES",
        "operands": [
            "6",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 6,D",
        "operation": "RES",
        "operands": [
            "6",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 6,E",
        "operation": "RES",
        "operands": [
            "6",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 6,H",
        "operation": "RES",
        "operands": [
            "6",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 6,L",
        "operation": "RES",
        "operands": [
            "6",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 6,(HL)",
        "operation": "RES",
        "operands": [
            "6",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 6,A",
        "operation": "RES",
        "operands": [
            "6",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 7,B",
        "operation": "RES",
        "operands": [
            "7",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 7,C",
        "operation": "RES",
        "operands": [
            "7",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 7,D",
        "operation": "RES",
        "operands": [
            "7",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 7,E",
        "operation": "RES",
        "operands": [
            "7",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 7,H",
        "operation": "RES",
        "operands": [
            "7",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 7,L",
        "operation": "RES",
        "operands": [
            "7",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 7,(HL)",
        "operation": "RES",
        "operands": [
            "7",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "RES 7,A",
        "operation": "RES",
        "operands": [
            "7",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 0,B",
        "operation": "SET",
        "operands": [
            "0",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 0,C",
        "operation": "SET",
        "operands": [
            "0",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 0,D",
        "operation": "SET",
        "operands": [
            "0",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 0,E",
        "operation": "SET",
        "operands": [
            "0",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 0,H",
        "operation": "SET",
        "operands": [
            "0",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 0,L",
        "operation": "SET",
        "operands": [
            "0",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 0,(HL)",
        "operation": "SET",
        "operands": [
            "0",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 0,A",
        "operation": "SET",
        "operands": [
            "0",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 1,B",
        "operation": "SET",
        "operands": [
            "1",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 1,C",
        "operation": "SET",
        "operands": [
            "1",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 1,D",
        "operation": "SET",
        "operands": [
            "1",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 1,E",
        "operation": "SET",
        "operands": [
            "1",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 1,H",
        "operation": "SET",
        "operands": [
            "1",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 1,L",
        "operation": "SET",
        "operands": [
            "1",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 1,(HL)",
        "operation": "SET",
        "operands": [
            "1",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 1,A",
        "operation": "SET",
        "operands": [
            "1",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 2,B",
        "operation": "SET",
        "operands": [
            "2",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 2,C",
        "operation": "SET",
        "operands": [
            "2",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 2,D",
        "operation": "SET",
        "operands": [
            "2",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 2,E",
        "operation": "SET",
        "operands": [
            "2",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 2,H",
        "operation": "SET",
        "operands": [
            "2",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 2,L",
        "operation": "SET",
        "operands": [
            "2",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 2,(HL)",
        "operation": "SET",
        "operands": [
            "2",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 2,A",
        "operation": "SET",
        "operands": [
            "2",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 3,B",
        "operation": "SET",
        "operands": [
            "3",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 3,C",
        "operation": "SET",
        "operands": [
            "3",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 3,D",
        "operation": "SET",
        "operands": [
            "3",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 3,E",
        "operation": "SET",
        "operands": [
            "3",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 3,H",
        "operation": "SET",
        "operands": [
            "3",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 3,L",
        "operation": "SET",
        "operands": [
            "3",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 3,(HL)",
        "operation": "SET",
        "operands": [
            "3",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 3,A",
        "operation": "SET",
        "operands": [
            "3",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 4,B",
        "operation": "SET",
        "operands": [
            "4",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 4,C",
        "operation": "SET",
        "operands": [
            "4",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 4,D",
        "operation": "SET",
        "operands": [
            "4",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 4,E",
        "operation": "SET",
        "operands": [
            "4",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 4,H",
        "operation": "SET",
        "operands": [
            "4",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 4,L",
        "operation": "SET",
        "operands": [
            "4",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 4,(HL)",
        "operation": "SET",
        "operands": [
            "4",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 4,A",
        "operation": "SET",
        "operands": [
            "4",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 5,B",
        "operation": "SET",
        "operands": [
            "5",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 5,C",
        "operation": "SET",
        "operands": [
            "5",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 5,D",
        "operation": "SET",
        "operands": [
            "5",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 5,E",
        "operation": "SET",
        "operands": [
            "5",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 5,H",
        "operation": "SET",
        "operands": [
            "5",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 5,L",
        "operation": "SET",
        "operands": [
            "5",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 5,(HL)",
        "operation": "SET",
        "operands": [
            "5",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 5,A",
        "operation": "SET",
        "operands": [
            "5",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 6,B",
        "operation": "SET",
        "operands": [
            "6",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 6,C",
        "operation": "SET",
        "operands": [
            "6",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 6,D",
        "operation": "SET",
        "operands": [
            "6",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 6,E",
        "operation": "SET",
        "operands": [
            "6",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 6,H",
        "operation": "SET",
        "operands": [
            "6",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 6,L",
        "operation": "SET",
        "operands": [
            "6",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 6,(HL)",
        "operation": "SET",
        "operands": [
            "6",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 6,A",
        "operation": "SET",
        "operands": [
            "6",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 7,B",
        "operation": "SET",
        "operands": [
            "7",
            "B"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 7,C",
        "operation": "SET",
        "operands": [
            "7",
            "C"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 7,D",
        "operation": "SET",
        "operands": [
            "7",
            "D"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 7,E",
        "operation": "SET",
        "operands": [
            "7",
            "E"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 7,H",
        "operation": "SET",
        "operands": [
            "7",
            "H"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 7,L",
        "operation": "SET",
        "operands": [
            "7",
            "L"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 7,(HL)",
        "operation": "SET",
        "operands": [
            "7",
            "(HL)"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            16
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    },
    {
        "label": "SET 7,A",
        "operation": "SET",
        "operands": [
            "7",
            "A"
        ],
        "opcode_length": 1,
        "clock_cycles": [
            8
        ],
        "setZero": false,
        "setSubtract": false,
        "setHalfCarry": false,
        "setCarry": false
    }
];