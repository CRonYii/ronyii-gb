import { Register8 } from "../cpu/Register";
import { Memory } from "../memory/Memory";
import NoiseChannel from "./NoiseChannel";
import SquareChannel from "./SquareChannel";
import SweepChannel from "./SweepChannel";
import WaveChannel from "./WaveChannel";

export interface SoundUnit extends Memory {
    powerOff(): void,
    isOn(): boolean,
}

export default class APU implements SoundUnit {

    private readonly audioCtx: AudioContext;

    private readonly channelControl: Register8 = new Register8(); // 0xff24 - NR50
    private readonly outputSelection: Register8 = new Register8(); // 0xff25 - NR51
    private readonly soundEnabled: Register8 = new Register8(); // 0xff246- NR52

    private readonly sweepChannel: SweepChannel;
    private readonly toneChannel1: SquareChannel;
    private readonly toneChannel2: SquareChannel;
    private readonly waveChannel: WaveChannel;
    private readonly noiseChannel: NoiseChannel;

    constructor() {
        this.audioCtx = new AudioContext();
        this.sweepChannel = new SweepChannel(this.audioCtx);
        this.toneChannel1 = new SquareChannel(this.audioCtx);
        this.toneChannel2 = new SquareChannel(this.audioCtx);
        this.waveChannel = new WaveChannel(this.audioCtx);
        this.noiseChannel = new NoiseChannel(this.audioCtx);
    }

    setByte(address: number, data: number) {
        if ((address >= 0xff1a && address <= 0xff1e) || (address >= 0xff30 && address <= 0xff3f)) {
            return this.waveChannel.setByte(address, data);
        }
        if (address >= 0xff11 && address <= 0xff14) {
            return this.toneChannel1.setByte(address - 0xff11, data);
        }
        if (address >= 0xff16 && address <= 0xff19) {
            return this.toneChannel2.setByte(address - 0xff16, data);
        }
        if (address >= 0xff20 && address <= 0xff23) {
            return this.noiseChannel.setByte(address, data);
        }
        switch (address) {
            case 0xff10: return this.sweepChannel.setByte(address, data);
            case 0xff24: return this.channelControl.set(data);
            case 0xff25: return this.outputSelection.set(data);
            case 0xff26:
                this.soundEnabled.set(data & 0x80);
                if (!this.isOn()) {
                    this.sweepChannel.powerOff();
                    this.toneChannel1.powerOff();
                    this.toneChannel2.powerOff();
                    this.waveChannel.powerOff();
                    this.noiseChannel.powerOff();
                    this.powerOff();
                }
                return;
        }
    }

    /**
     * Most of the APU registers will be ORed with value when read
     * This is to mask the unused bits to read as 0b1
     */
    getByte(address: number): number {
        if ((address >= 0xff1a && address <= 0xff1e) || (address >= 0xff30 && address <= 0xff3f)) {
            return this.waveChannel.getByte(address);
        }
        if (address >= 0xff11 && address <= 0xff14) {
            return this.toneChannel1.getByte(address - 0xff11);
        }
        if (address >= 0xff16 && address <= 0xff19) {
            return this.toneChannel2.getByte(address - 0xff16);
        }
        if (address >= 0xff20 && address <= 0xff23) {
            return this.noiseChannel.getByte(address);
        }
        switch (address) {
            case 0xff10: return this.sweepChannel.getByte(address);
            case 0xff24: return this.channelControl.get();
            case 0xff25: return this.outputSelection.get();
            case 0xff26:
                return (
                    (this.soundEnabled.get()) |
                    (this.toneChannel1.isOn() ? 0x1 : 0) |
                    (this.toneChannel2.isOn() ? 0x2 : 0) |
                    (this.waveChannel.isOn() ? 0x4 : 0) |
                    (this.noiseChannel.isOn() ? 0x8 : 0)
                ) | 0x70;
        }
        return 0xff;
    }

    powerOff() {
        this.channelControl.set(0);
        this.outputSelection.set(0);
        this.soundEnabled.set(0);
    }

    isOn(): boolean {
        return (this.soundEnabled.get() & 0x80) !== 0;
    }

    size() {
        return 0x30;
    }

}