import { Register8 } from "../cpu/Register";
import { Memory, MemorySegment } from "../memory/Memory";
import { SoundUnit } from "./APU";
import LengthCounter from "./LengthCounter";

export default class WaveChannel implements SoundUnit {

    private readonly audioCtx: AudioContext;

    public readonly lengthCounter: LengthCounter = new LengthCounter(this);

    private trigger: boolean = false;

    private readonly soundEnabled: Register8 = new Register8(); // 0xff1a - NR30
    private readonly outputLevel: Register8 = new Register8(); // 0xff1c - NR32
    private readonly frequencyLow: Register8 = new Register8(); // 0xff1d - NR33
    private readonly frequencyHigh: Register8 = new Register8(); // 0xff1e - NR34

    // 0xff30 ~ 0xff3f (16 bytes / 32 * 4 bits)
    private readonly wavePattern: Memory = new MemorySegment({ size: 0x10, offset: 0xff30, readable: true, writable: true });

    constructor(audioCtx: AudioContext) {
        this.audioCtx = audioCtx;
    }

    setByte(address: number, data: number) {
        if (address >= 0xff30 && address <= 0xff3f) {
            return this.wavePattern.setByte(address, data);
        }
        switch (address) {
            case 0xff1a: return this.soundEnabled.set(data & 0x80);
            case 0xff1b: return this.lengthCounter.reload((1 << 8) - (data));;
            case 0xff1c: return this.outputLevel.set(data);
            case 0xff1d: return this.frequencyLow.set(data);
            case 0xff1e:
                this.frequencyHigh.set(data);
                this.trigger = (data & 0x80) !== 0;
                if (this.isOn()) {
                    if (this.lengthCounter.counter === 0 || !this.isLengthCounterEnable()) {
                        this.lengthCounter.reload(1 << 8);
                    }
                }
                return;
        }
    }

    getByte(address: number): number {
        if (address >= 0xff30 && address <= 0xff3f) {
            return this.wavePattern.getByte(address);
        }
        switch (address) {
            case 0xff1a: return this.soundEnabled.get() | 0x7f;
            case 0xff1b: return 0xff;
            case 0xff1c: return this.outputLevel.get() | 0x9f;
            case 0xff1d: return 0xff;
            case 0xff1e: return this.frequencyHigh.get() | 0xbf;
        }
        throw new Error('Unsupported SquareChannel register');
    }

    get power(): boolean {
        return this.soundEnabled.get() !== 0;
    }

    powerOff() {
        this.setByte(0xff1a, 0);
        this.setByte(0xff1b, 0);
        this.setByte(0xff1c, 0);
        this.setByte(0xff1d, 0);
        this.setByte(0xff1e, 0);
    }

    setTrigger(trigger: boolean): void {
        this.trigger = trigger;
    }

    isOn(): boolean {
        return this.trigger && this.power;
    }

    isLengthCounterEnable(): boolean {
        return (this.frequencyHigh.get() & 0x40) !== 0;
    }

    size() {
        return 4;
    }

}