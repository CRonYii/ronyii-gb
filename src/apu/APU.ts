import { CPU_CLOCK_SPEED } from "../constants/index";
import { ClockTask } from "../cpu/Clock";
import { Register8 } from "../cpu/Register";
import Timer from "../utils/Timer";
import NoiseChannel from "./NoiseChannel";
import SquareChannel from "./SquareChannel";
import WaveChannel from "./WaveChannel";

export default class APU implements ClockTask {

    private readonly audioCtx: AudioContext;

    // The frame sequencer generates low frequency clocks for the modulation units. It is clocked by a 512 Hz timer.
    private readonly timer: Timer = new Timer(CPU_CLOCK_SPEED / 512);
    private step: number = -1;

    private readonly channelControl: Register8 = new Register8(); // 0xff24 - NR50
    private readonly outputSelection: Register8 = new Register8(); // 0xff25 - NR51
    private readonly soundEnabled: Register8 = new Register8(); // 0xff246- NR52

    private readonly soundChannel1: SquareChannel;
    private readonly soundChannel2: SquareChannel;
    private readonly waveChannel: WaveChannel;
    private readonly noiseChannel: NoiseChannel;

    constructor() {
        this.audioCtx = new AudioContext();
        this.soundChannel1 = new SquareChannel(this.audioCtx, true);
        this.soundChannel2 = new SquareChannel(this.audioCtx, false);
        this.waveChannel = new WaveChannel(this.audioCtx);
        this.noiseChannel = new NoiseChannel(this.audioCtx);
    }

    tick(cyclesTaken: number) {
        if (this.timer.tick(cyclesTaken) > 0) {
            // Power state does not affect the 512 Hz timer that feeds the frame sequencer.
            if (!this.isOn()) {
                return 0;
            }
            this.step += 1;
            this.step %= 8;
            switch (this.step) {
                case 2: case 6:
                    this.soundChannel1.sweep.tick();
                case 0: case 4:
                    this.soundChannel1.lengthCounter.tick();
                    this.soundChannel2.lengthCounter.tick();
                    this.waveChannel.lengthCounter.tick();
                    this.noiseChannel.lengthCounter.tick();
                    break;
                case 7:
                    // TODO: Volume Envelope
                    break;
            }
        }
        return 0;
    }

    setByte(address: number, data: number) {
        if (!this.isOn() && address !== 0xff26) {
            return;
        }
        if ((address >= 0xff1a && address <= 0xff1e) || (address >= 0xff30 && address <= 0xff3f)) {
            return this.waveChannel.setByte(address, data);
        }
        if (address >= 0xff10 && address <= 0xff14) {
            return this.soundChannel1.setByte(address - 0xff10, data);
        }
        if (address >= 0xff15 && address <= 0xff19) {
            return this.soundChannel2.setByte(address - 0xff15, data);
        }
        if (address >= 0xff20 && address <= 0xff23) {
            return this.noiseChannel.setByte(address, data);
        }
        switch (address) {
            case 0xff24: return this.channelControl.set(data);
            case 0xff25: return this.outputSelection.set(data);
            case 0xff26:
                this.soundEnabled.set(data & 0x80);
                if (this.isOn()) {
                    // When powered on, the frame sequencer is reset so that the next step will be 0, 
                    this.step = -1;
                    // the square duty units are reset to the first step of the waveform
                    // TODO
                    // the wave channel's sample buffer is reset to 0.
                    for (let i = 0xff30; i <= 0xff3f; i++) {
                        this.setByte(i, 0);
                    }
                } else {
                    // When powered off, all registers (NR10-NR51) are instantly written with zero
                    this.soundChannel1.powerOff();
                    this.soundChannel2.powerOff();
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
        if (address >= 0xff10 && address <= 0xff14) {
            return this.soundChannel1.getByte(address - 0xff10);
        }
        if (address >= 0xff15 && address <= 0xff19) {
            return this.soundChannel2.getByte(address - 0xff15);
        }
        if (address >= 0xff20 && address <= 0xff23) {
            return this.noiseChannel.getByte(address);
        }
        switch (address) {
            case 0xff24: return this.channelControl.get();
            case 0xff25: return this.outputSelection.get();
            case 0xff26:
                return (
                    (this.soundEnabled.get()) |
                    (this.soundChannel1.isOn() ? 0x1 : 0) |
                    (this.soundChannel2.isOn() ? 0x2 : 0) |
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