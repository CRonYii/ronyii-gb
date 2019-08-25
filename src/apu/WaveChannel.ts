import { Memory, MemorySegment } from "../memory/Memory";
import { Register8 } from "../cpu/Register";

export default class WaveChannel implements Memory {

    private readonly audioCtx: AudioContext;

    private readonly soundEnabled: Register8 = new Register8(); // 0xff1a - NR30
    private readonly soundLength: Register8 = new Register8(); // 0xff1b - NR31
    private readonly outputLevel: Register8 = new Register8(); // 0xff1c - NR32
    private readonly frequencyLow: Register8 = new Register8(); // 0xff1d - NR33
    private readonly frequencyHigh: Register8 = new Register8(); // 0xff1e - NR34

    // 0xff30 ~ 0xff3f (16 bytes / 32 * 4 bits)
    private readonly wavePattern: Memory = new MemorySegment({ size: 0xf, offset: 0xff30, readable: true, writable: true });

    constructor(audioCtx: AudioContext) {
        this.audioCtx = audioCtx;
    }

    setByte(address: number, data: number) {
        if (address >= 0xff30 && address <= 0xff3f) {
            return this.wavePattern.setByte(address, data);
        }
        switch (address) {
            case 0xff1a: return this.soundEnabled.set(data);
            case 0xff1b: return this.soundLength.set(data);
            case 0xff1c: return this.outputLevel.set(data);
            case 0xff1d: return this.frequencyLow.set(data);
            case 0xff1e: return this.frequencyHigh.set(data);
        }
    }

    getByte(address: number): number {
        if (address >= 0xff30 && address <= 0xff3f) {
            return this.wavePattern.getByte(address);
        }
        switch (address) {
            case 0xff1a: return this.soundEnabled.get();
            case 0xff1b: return this.soundLength.get();
            case 0xff1c: return this.outputLevel.get();
            case 0xff1d: return 0;
            case 0xff1e: return this.frequencyHigh.get() & 0x40;
        }
        throw new Error('Unsupported SquareChannel register');
    }

    size() {
        return 4;
    }

}