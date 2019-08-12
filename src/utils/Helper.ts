import { ByteBufferable, byteBuffer } from "./ByteBuffer";

const decoder = new TextDecoder();

export default {
    toSigned8(num: number) {
        return new Int8Array([num])[0];
    },
    toText(buffer: ArrayBuffer, start: number, end: number) {
        return decoder.decode(buffer.slice(start, end));
    },
    toHexText(buffer: ByteBufferable, precision: number) {
        return byteBuffer.toPrecision(
            byteBuffer.toHex(byteBuffer.from(buffer, precision)),
            precision
        );
    },
    parseParentheses(value: string): string | null {
        if (value[0] === '(' && value[value.length - 1] === ')') {
            return value.substring(1, value.length - 1);
        }
        return null;
    }
};