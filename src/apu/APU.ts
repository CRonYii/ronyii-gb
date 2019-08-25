import { Register8 } from "../cpu/Register";
import { Memory } from "../memory/Memory";
import NoiseChannel from "./NoiseChannel";
import SquareChannel from "./SquareChannel";
import SweepChannel from "./SweepChannel";
import WaveChannel from "./WaveChannel";

export default class APU implements Memory {

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
            case 0xff26: return this.soundEnabled.set(data & 0x8000);
        }
    }

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
            case 0xff26: return this.soundEnabled.get() | 0x70;
        }
        return 0xff;
    }

    size() {
        return 0x30;
    }

}