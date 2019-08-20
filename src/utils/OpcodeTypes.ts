export type DataType = 'd8' | 'd16' | 'r8' | 'a16';

export function isDataType(arg: string): arg is DataType {
    return arg === 'd8' || arg === 'd16' || arg === 'r8' || arg === 'a16';
}

export type RegisterType =
    'AF' | 'BC' | 'DE' | 'HL' |
    'A' | 'F' | 'B' | 'C' |
    'D' | 'E' | 'H' | 'L' |
    'SP' | 'PC';

export const memoryReaderTypes = ['(BC)', '(DE)', '(HL)', '(C)', '(HL+)', '(HL-)'];
export type MemoryReaderType = '(BC)' | '(DE)' | '(HL)' | '(C)' | '(HL+)' | '(HL-)';

export function isMemoryReaderType(arg: string): arg is MemoryReaderType {
    return memoryReaderTypes.includes(arg);
};

export const registerTypes = [
    'AF', 'BC', 'DE', 'HL',
    'A', 'F', 'B', 'C',
    'D', 'E', 'H', 'L',
    'SP', 'PC'
];

export function isRegisterType(arg: string): arg is RegisterType {
    return registerTypes.includes(arg);
}

export type FlagMode = 'Z' | 'NZ' | 'C' | 'NC';

export function isFlagMode(arg: string): arg is FlagMode {
    return arg === 'Z' || arg === 'NZ' || arg === 'C' || arg === 'NC';
}

export function parseByteIndex(operand: string): number {
    const val = Number(operand);
    if (val >= 0 && val <= 7) {
        return val;
    }
    throw new Error('Expected a number in range [0, 7]');
}

export const specialAddresses = [0x00, 0x08, 0x10, 0x18, 0x20, 0x28, 0x30, 0x38, 0x40, 0x48, 0x50, 0x58, 0x60];

export type RSTAddress = 0x00 | 0x08 | 0x10 | 0x18 | 0x20 | 0x28 | 0x30 | 0x38 | 0x40 | 0x48 | 0x50 | 0x58 | 0x60;

export function isRSTAddress(arg: number): arg is RSTAddress {
    return specialAddresses.includes(arg);
}

export function parseRSTAddress(operand: string): RSTAddress {
    operand = '0x' + operand.substring(0, operand.length - 1);
    const val = Number(operand);
    if (isRSTAddress(val)) {
        return val;
    };
    throw new Error('Expected a number one of [0x00, 0x08, 0x10, 0x18, 0x20, 0x28, 0x30, 0x38, 0x40, 0x48, 0x50, 0x58, 0x60], got ' + operand);
}