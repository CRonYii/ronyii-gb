import { Register8 } from "../cpu/Register";
import { Memory, MemorySegment } from "../memory/Memory";
import LengthCounter from "./LengthCounter";
import SoundUnit from "./SoundUnit";

export default class WaveChannel extends SoundUnit {

    private readonly audioCtx: AudioContext;

    public readonly lengthCounter: LengthCounter = new LengthCounter(this, 1 << 8);

    private readonly outputLevel: Register8 = new Register8(); // 0xff1c - NR32
    private readonly frequencyLow: Register8 = new Register8(); // 0xff1d - NR33
    private readonly frequencyHigh: Register8 = new Register8(); // 0xff1e - NR34

    // 0xff30 ~ 0xff3f (16 bytes / 32 * 4 bits)
    private readonly wavePattern: Memory = new MemorySegment({ size: 0x10, offset: 0xff30, readable: true, writable: true });

    constructor(audioCtx: AudioContext) {
        super("Wave Channel");
        this.audioCtx = audioCtx;
    }

    setByte(address: number, data: number) {
        if (address >= 0xff30 && address <= 0xff3f) {
            return this.wavePattern.setByte(address, data);
        }
        switch (address) {
            case 0xff1a: return this.setPower((data & 0x80) !== 0);
            case 0xff1b: return this.lengthCounter.reload(data);
            case 0xff1c: return this.outputLevel.set(data);
            case 0xff1d: return this.frequencyLow.set(data);
            case 0xff1e:
                this.frequencyHigh.set(data & 0b111);
                this.setTriggerAndLengthCounter(data);
                return;
        }
    }

    getByte(address: number): number {
        if (address >= 0xff30 && address <= 0xff3f) {
            return this.wavePattern.getByte(address);
        }
        switch (address) {
            case 0xff1a: return (this.isDACOn() ? 0x80 : 0) | 0x7f;
            case 0xff1b: return 0xff;
            case 0xff1c: return this.outputLevel.get() | 0x9f;
            case 0xff1d: return 0xff;
            case 0xff1e: return (this.isLengthCounterEnable() ? 0x40 : 0) | 0xbf;
        }
        throw new Error('Unsupported SquareChannel register');
    }

    powerOff() {
        this.setByte(0xff1a, 0);
        this.setByte(0xff1b, 0);
        this.setByte(0xff1c, 0);
        this.setByte(0xff1d, 0);
        this.setByte(0xff1e, 0);
    }

    size() {
        return 4;
    }

}