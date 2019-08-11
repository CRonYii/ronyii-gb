import { Memory } from "./Memory";
import { MEMORY_SIZE } from "../constants/index";

// Memory Management Unit
export default class MMU extends Memory {

    static WORD_NUM_BYTES = 2;

    constructor() {
        super({ size: MEMORY_SIZE });
    }

    setWord(address: number, data: number) {
        this.set(address, MMU.WORD_NUM_BYTES, data);
    }

    getWord(address: number): Uint8Array {
        return this.get(address, MMU.WORD_NUM_BYTES);
    }

};