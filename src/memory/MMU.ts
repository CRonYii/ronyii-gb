import { Memory } from "./Memory";
import { MEMORY_SIZE } from "../constants/index";
import { byteBuffer } from "../utils/ByteBuffer";

// Memory Management Unit
export default class MMU extends Memory {

    static WORD_NUM_BYTES = 2;

    constructor() {
        super({ size: MEMORY_SIZE });
    }

    setWord(address: number, data: number) {
        this.set(address, MMU.WORD_NUM_BYTES, data);
    }

    getWord(address: number): number {
        return byteBuffer.value(this.get(address, MMU.WORD_NUM_BYTES));
    }

};