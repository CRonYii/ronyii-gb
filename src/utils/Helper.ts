const decoder = new TextDecoder();

export default {
    toText(buffer: ArrayBuffer, start: number, end: number) {
        return decoder.decode(buffer.slice(start, end));
    }
};