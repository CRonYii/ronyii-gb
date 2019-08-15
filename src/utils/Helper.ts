import { CB_OPCODES, OPCODES } from "../cpu/Opcodes";

const decoder = new TextDecoder();

export default {
    toUnsigned32(num: number) {
        return new Uint32Array([num])[0]
    },
    toSigned8(num: number) {
        return new Int8Array([num])[0];
    },
    toText(buffer: ArrayBuffer, start: number, end: number) {
        return decoder.decode(buffer.slice(start, end));
    },
    toHexText(value: number, precision: number) {
        return '0x' + value.toString(16).padStart(precision, '0').toUpperCase();
    },
    parseParentheses(value: string): string | null {
        if (value[0] === '(' && value[value.length - 1] === ')') {
            return value.substring(1, value.length - 1);
        }
        return null;
    },
    toAssembly(executable: Uint8Array): string {
        const assembly = [];
        for (let i = 0; i < executable.length;) {
            let opcode;
            if (assembly[assembly.length - 1] === 'PREFIX CB') {
                opcode = CB_OPCODES[executable[i]]
            } else {
                opcode = OPCODES[executable[i]];
            }
            if (!opcode) {
                assembly.push('Encounter Error: ' + this.toHexText(executable[i], 2));
                break;
            }
            assembly.push(opcode.label);
            i += opcode.opcode_length;
        }
        return assembly.join('\n');
    }
};