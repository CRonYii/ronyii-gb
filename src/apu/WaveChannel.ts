import { Memory, MemorySegment } from "../memory/Memory";
import LengthCounter from "./LengthCounter";
import SoundUnit from "./SoundUnit";

export default class WaveChannel extends SoundUnit {

    public readonly lengthCounter: LengthCounter = new LengthCounter(this, 1 << 8);

    private outputLevel: number = 0; // 0xff1c - NR32
    private frequency: number = 0;

    // 0xff30 ~ 0xff3f (16 bytes / 32 * 4 bits)
    private readonly wavePattern: Memory = new MemorySegment({ size: 0x10, offset: 0xff30, readable: true, writable: true });

    constructor(audioCtx: AudioContext) {
        super("Wave Channel", audioCtx);
    }

    sample() {
        return 0;
    }

    setByte(address: number, data: number) {
        if (address >= 0xff30 && address <= 0xff3f) {
            return this.wavePattern.setByte(address, data);
        }
        switch (address) {
            case 0xff1a: return this.setPower((data & 0x80) !== 0);
            case 0xff1b: return this.lengthCounter.reload(data);
            case 0xff1c: return this.outputLevel = (data & 0x60) >> 5;
            case 0xff1d: return this.frequency = (this.frequency & 0x700) | data;
            case 0xff1e:
                this.frequency = (this.frequency & 0xff) | ((data & 0b111) << 8);
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
            case 0xff1c: return (this.outputLevel << 5) | 0x9f;
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