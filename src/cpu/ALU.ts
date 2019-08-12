export interface AdditionResult {
    sum: number,
    zero: boolean,
    carry: boolean,
    halfCarry: boolean
}

export default {
    add8(a: number, b: number): AdditionResult {
        let rawsum = a + b;
        const sum = rawsum & 0xff;

        return {
            sum,
            zero: sum === 0,
            carry: rawsum > 0xff,
            halfCarry: ((sum ^ b ^ a) & 0x10) !== 0
        };
    },
    add16(a: number, b: number): AdditionResult {
        let rawsum = a + b;
        const sum = rawsum & 0xffff;

        return {
            sum,
            zero: sum === 0,
            carry: rawsum > 0xffff,
            halfCarry: ((sum ^ b ^ a) & 0x1000) !== 0
        };
    }
};