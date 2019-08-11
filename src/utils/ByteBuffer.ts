import { Register } from "../cpu/Register";

export type BinaryDigit = 0 | 1;

export type ByteBuffer = Uint8Array;

export type ByteBufferable = ByteBuffer | Register | string | number;

const SupportedBase = {
    2: '0b',
    16: '0x'
} as const;

const hexToBinary: any = {
    '0': 0b0000,
    '1': 0b0001,
    '2': 0b0010,
    '3': 0b0011,
    '4': 0b0100,
    '5': 0b0101,
    '6': 0b0110,
    '7': 0b0111,
    '8': 0b1000,
    '9': 0b1001,
    'A': 0b1010,
    'B': 0b1011,
    'C': 0b1100,
    'D': 0b1101,
    'E': 0b1110,
    'F': 0b1111,
};

const binaryToHex: any = {
    0b0000: '0',
    0b0001: '1',
    0b0010: '2',
    0b0011: '3',
    0b0100: '4',
    0b0101: '5',
    0b0110: '6',
    0b0111: '7',
    0b1000: '8',
    0b1001: '9',
    0b1010: 'A',
    0b1011: 'B',
    0b1100: 'C',
    0b1101: 'D',
    0b1110: 'E',
    0b1111: 'F',
};

function fromHex(char: string): number {
    const hex = hexToBinary[char];
    if (hex === null) {
        throw new Error('The argument is not valid hex');
    }
    return hex;
}

const decToHex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];

export const BITS_IN_BYTE = 8;
export const BITS_IN_HEX = 4;

export const BYTE_FLAG = 0b11111111;
export const HEX_FLAG = 0b1111;

export const BYTE_MAX = 255;

function fromBase2(num: string, size: number): ByteBuffer {
    const result = new Uint8Array(size);
    for (let i = 0; i < size; i++) {
        try {
            const start = i * BITS_IN_BYTE;
            result[i] = Number('0b' + num.substring(start, start + 8));
        } catch (err) {
            throw new Error('The argument is not valid binary');
        }
    }
    return result;
}

function fromBase10(num: number, size: number): ByteBuffer {
    const result = new Uint8Array(size);
    for (let i = 0; i < size; i++) {
        result[size - i - 1] = BYTE_FLAG & num;
        num >>= BITS_IN_BYTE;
    }
    return result;
}

function fromBase16(num: string, size: number): ByteBuffer {
    let result = new Uint8Array(size);
    for (let i = 0, j = 0; i < size; i++ , j += 2) {
        const highWord = fromHex(num[j]) << 4;
        const lowWord = fromHex(num[j + 1]);
        const byteword = highWord | lowWord;
        result[i] = byteword;
    }
    return result;
}

export const byteBuffer = {
    from: function (data: ByteBufferable, size: number): ByteBuffer {
        if (typeof data === 'string') {
            const base = data.substring(0, 2);
            data = data.substring(2);
            switch (base) {
                case SupportedBase[2]: return fromBase2(data, size);
                case SupportedBase[16]: return fromBase16(data, size);
            };
        } else if (typeof data === 'number') {
            return fromBase10(data, size);
        } else if (data instanceof Uint8Array) {
            return data;
        } else if (data instanceof Register) {
            return data.data();
        } 
        return new Uint8Array(size);
    },
    value: function (buffer: ByteBuffer): number {
        let result = 0;
        for (let i = 0; i < buffer.length; i++) {
            result <<= BITS_IN_BYTE;
            const byte = buffer[i];
            result |= byte;
        }
        return result;
    },
    toHex: function (buffer: ByteBuffer): string {
        let result = '';
        for (let i = 0; i < buffer.length; i++) {
            const byteword = buffer[i];
            const highword = byteword >> BITS_IN_HEX;
            const lowWord = byteword & HEX_FLAG;
            result += binaryToHex[highword] + binaryToHex[lowWord];
        }
        return '0x' + result;
    },
    toPrecision: function (num: string, precision: number) {
        const prefix = num.substring(0, 2);
        if (prefix !== '0b' && prefix !== '0x') {
            return num;
        }
        num = num.substring(2);
        const offset = num.length - precision;
        if (offset < 0) {
            return prefix + '0'.repeat(-offset) + num;
        } else if (offset > 0) {
            return prefix + num.substring(offset);
        }
        return prefix + num;
    },
    is: function (arg: any): arg is ByteBuffer {
        return arg != null &&
            (
                typeof arg === 'string' || typeof arg === 'number' || arg instanceof Uint8Array
            );
    }
};