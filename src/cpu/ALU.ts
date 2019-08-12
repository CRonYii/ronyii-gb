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
    }
};