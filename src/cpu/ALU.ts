export interface ALUResult {
    result: number,
    zero?: boolean,
    carry?: boolean,
    halfCarry?: boolean
}

export default {
    add8(a: number, b: number, carry?: boolean): ALUResult {
        let raw = a + b;
        if (carry === true) {
            raw += 1;
        }
        const result = raw & 0xff;

        return {
            result,
            zero: result === 0,
            carry: raw > 0xff,
            halfCarry: ((result ^ b ^ a) & 0x10) !== 0
        };
    },
    add16(a: number, b: number, carry?: boolean): ALUResult {
        let raw = a + b;
        if (carry === true) {
            raw += 1;
        }
        const result = raw & 0xffff;

        return {
            result,
            zero: result === 0,
            carry: raw > 0xffff,
            halfCarry: ((result ^ b ^ a) & 0x1000) !== 0
        };
    },
    sub8(a: number, b: number, carry?: boolean): ALUResult {
        let raw = a - b;
        if (carry === true) {
            raw -= 1;
        }
        const result = raw & 0xff;

        return {
            result,
            zero: result === 0,
            carry: raw < 0,
            halfCarry: ((result ^ b ^ a) & 0x10) !== 0
        };
    },
    sub16(a: number, b: number, carry?: boolean): ALUResult {
        let raw = a - b;
        if (carry === true) {
            raw -= 1;
        }
        const result = raw & 0xffff;

        return {
            result: result,
            zero: result === 0,
            carry: raw < 0,
            halfCarry: ((result ^ b ^ a) & 0x1000) !== 0
        };
    },
    or(a: number, b: number): ALUResult {
        const result = (a | b) & 0xff;
        return {
            result,
            zero: result === 0
        };
    },
    xor(a: number, b: number): ALUResult {
        const result = (a ^ b) & 0xff;
        return {
            result,
            zero: result === 0
        };
    },
    swap8(value: number): ALUResult {
        const upper = value & 0xf0;
        const lower = value & 0x0f;
        const result = (upper >> 4) | (lower << 4);

        return {
            result,
            zero: result === 0
        };
    },
    shiftLeft8(value: number, LSB: boolean, carry?: boolean): ALUResult {
        const leftMostBit = (value & 0x80) ? 1 : 0;
        let result = value << 1;
        if (LSB) {
            const padBit = (carry == undefined)
                ? leftMostBit
                : carry === true ? 1 : 0;
            result += padBit;
        }
        result &= 0xff;

        return {
            result,
            zero: result === 0,
            carry: leftMostBit === 1
        };
    },
    shiftRight8(value: number, MSB: boolean, carry?: boolean): ALUResult {
        const rightMostBit = (value & 0x1) ? 0x80 : 0;
        let result = value >> 1;
        if (MSB) {
            const padBit = (carry == undefined)
                ? rightMostBit
                : carry === true ? 0x80 : 0;
            result += padBit;
        }
        result &= 0xff;

        return {
            result,
            zero: result === 0,
            carry: rightMostBit === 0x80
        };
    }
};