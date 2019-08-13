import { MEMORY_SIZE } from "../constants/index";
import { byteBuffer } from "../utils/ByteBuffer";
import { Memory } from "./Memory";
import MemorySegmentDefinitions from "./MemorySegmentDefinitions";
import FlagManager from "./FlagManager";

const InterruptsFlags = {
    'VBlank': 1,
    'LCDC': 1 << 1,
    'Timer': 1 << 2,
    'Serial': 1 << 3,
    'Joypad': 1 << 4,
};

export type InterruptFlagsEKey = keyof typeof InterruptsFlags;

// Memory Management Unit
export default class MMU extends Memory {

    static WORD_NUM_BYTES = 2;

    public readonly interruptEnableManager = new FlagManager<InterruptFlagsEKey>({
        get: () => this.getByte(0xffff),
        set: (byte) => this.setByte(0xffff, byte)
    }, InterruptsFlags);

    public readonly interruptFlagsManager = new FlagManager<InterruptFlagsEKey>({
        get: () => this.getByte(0xff0f),
        set: (byte) => this.setByte(0xff0f, byte)
    }, InterruptsFlags);

    constructor() {
        super({ size: MEMORY_SIZE, controllers: MemorySegmentDefinitions });
    }

    setWord(address: number, data: number) {
        this.set(address, MMU.WORD_NUM_BYTES, data);
    }

    getWord(address: number): number {
        return byteBuffer.value(this.get(address, MMU.WORD_NUM_BYTES));
    }

    shouldInterrupt(key: InterruptFlagsEKey) {
        return this.interruptEnableManager.get(key)
            && this.interruptFlagsManager.get(key);
    }

};