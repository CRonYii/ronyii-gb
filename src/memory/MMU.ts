import { MEMORY_SIZE } from "../constants/index";
import { byteBuffer } from "../utils/ByteBuffer";
import { Memory } from "./Memory";
import MemorySegmentDefinitions from "./MemorySegmentDefinitions";
import FlagManager from "../utils/FlagManager";

const InterruptsFlags = {
    'VBlank': 0,
    'LCDC': 1,
    'Timer': 2,
    'Serial': 3,
    'Joypad': 4,
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
        this.setByte(0xFF05, 0x00); // TIMA
        this.setByte(0xFF06, 0x00); // TMA
        this.setByte(0xFF07, 0x00); // TAC
        this.setByte(0xFF10, 0x80); // NR10
        this.setByte(0xFF11, 0xBF); // NR11
        this.setByte(0xFF12, 0xF3); // NR12
        this.setByte(0xFF14, 0xBF); // NR14
        this.setByte(0xFF16, 0x3F); // NR21
        this.setByte(0xFF17, 0x00); // NR22
        this.setByte(0xFF19, 0xBF); // NR24
        this.setByte(0xFF1A, 0x7F); // NR30
        this.setByte(0xFF1B, 0xFF); // NR31
        this.setByte(0xFF1C, 0x9F); // NR32
        this.setByte(0xFF1E, 0xBF); // NR33
        this.setByte(0xFF20, 0xFF); // NR41
        this.setByte(0xFF21, 0x00); // NR42
        this.setByte(0xFF22, 0x00); // NR43
        this.setByte(0xFF23, 0xBF); // NR30
        this.setByte(0xFF24, 0x77); // NR50
        this.setByte(0xFF25, 0xF3); // NR51
        this.setByte(0xFF26, 0xF1); // NR52
        this.setByte(0xFF40, 0x91); // LCDC
        this.setByte(0xFF42, 0x00); // SCY
        this.setByte(0xFF43, 0x00); // SCX
        this.setByte(0xFF45, 0x00); // LYC
        this.setByte(0xFF47, 0xFC); // BGP
        this.setByte(0xFF48, 0xFF); // OBP0
        this.setByte(0xFF49, 0xFF); // OBP1
        this.setByte(0xFF4A, 0x00); // WY
        this.setByte(0xFF4B, 0x00); // WX
        this.setByte(0xFFFF, 0x00); // IE
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