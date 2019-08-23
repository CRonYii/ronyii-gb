import { CB_OPCODES, OPCODES } from "../cpu/Opcodes";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export default {
    toUnsigned32(num: number) {
        return new Uint32Array([num])[0]
    },
    toSigned8(num: number) {
        return new Int8Array([num])[0];
    },
    toUnsigned8(num: number) {
        return new Uint8Array([num])[0]
    },
    toUnsigned16(num: number) {
        return new Uint16Array([num])[0]
    },
    toText(buffer: ArrayBuffer, start: number, end: number) {
        return decoder.decode(buffer.slice(start, end));
    },
    fromText(text: string) {
        return encoder.encode(text);
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
    },
    download(filename: string, data: ArrayBuffer) {
        const file = new Blob([data]);
        const a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    },
};