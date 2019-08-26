import { CPU_CLOCK_SPEED } from "../constants/index";
import { ClockTask } from "../cpu/Clock";
import { Register8 } from "../cpu/Register";
import Timer from "../utils/Timer";
import NoiseChannel from "./NoiseChannel";
import SquareChannel from "./SquareChannel";
import WaveChannel from "./WaveChannel";

export default class APU implements ClockTask {

    private readonly audioCtx: AudioContext = new AudioContext();
    private readonly masterVolume: GainNode = this.audioCtx.createGain();
    private readonly merger: ChannelMergerNode = this.audioCtx.createChannelMerger(2);
    private readonly SO1: GainNode = this.audioCtx.createGain();
    private readonly SO2: GainNode = this.audioCtx.createGain();

    // The frame sequencer generates low frequency clocks for the modulation units. It is clocked by a 512 Hz timer.
    private readonly timer: Timer = new Timer(CPU_CLOCK_SPEED / 512); // 8192 cycles
    private step: number = -1;

    private SO1VolumeLevel: number = 0;
    private SO2VolumeLevel: number = 0;
    private vinSO1Enabled: boolean = false;
    private vinSO2Enabled: boolean = false;

    private sound1ToSO1: boolean = false;
    private sound1ToSO2: boolean = false;
    private sound2ToSO1: boolean = false;
    private sound2ToSO2: boolean = false;
    private sound3ToSO1: boolean = false;
    private sound3ToSO2: boolean = false;
    private sound4ToSO1: boolean = false;
    private sound4ToSO2: boolean = false;

    private soundEnabled: boolean = false;

    private readonly soundChannel1: SquareChannel = new SquareChannel(this.audioCtx, true);;
    private readonly soundChannel2: SquareChannel = new SquareChannel(this.audioCtx, false);;
    private readonly waveChannel: WaveChannel = new WaveChannel(this.audioCtx);;
    private readonly noiseChannel: NoiseChannel = new NoiseChannel(this.audioCtx);;

    constructor() {
        this.SO1.connect(this.merger, 0, 0);
        this.SO2.connect(this.merger, 0, 1);

        this.merger.connect(this.masterVolume);

        this.masterVolume.gain.value = 0;
        this.masterVolume.connect(this.audioCtx.destination);
    }

    tick(cyclesTaken: number) {
        if (this.timer.tick(cyclesTaken) > 0) {
            // Power state does not affect the 512 Hz timer that feeds the frame sequencer.
            if (!this.isOn()) {
                return 0;
            }
            /**
             * Length Counter is clocked at 256Hz freq
             * Sweep is clocked at 128Hz freq
             * Volume Envelope is clocked at 64Hz freq
             */
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
                    this.soundChannel1.volumeEnvelope.tick();
                    this.soundChannel2.volumeEnvelope.tick();
                    this.noiseChannel.volumeEnvelope.tick();
                    break;
            }
            this.mix();
        }
        return 0;
    }

    mix() {
        // Adjust the output terminal volume accoring to NR50
        this.SO1.gain.value = this.SO1Volume;
        this.SO2.gain.value = this.SO2Volume;

        // TODO: connect the remaining nodes
        this.connectOutputTerminal(this.soundChannel1.getOuputNode(), this.sound1ToSO1, this.sound1ToSO2);
    }

    connectOutputTerminal(outputNode: AudioNode, connectToSO1: boolean, connectToSO2: boolean) {
        // disconnect from all previous node
        outputNode.disconnect();
        if (connectToSO1) {
            outputNode.connect(this.SO1);
        }
        if (connectToSO2) {
            outputNode.connect(this.SO2);
        }
    }

    setByte(address: number, data: number) {
        if (!this.isOn() && address !== 0xff26 && address !== 0xff20) {
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
            case 0xff24:
                this.SO1VolumeLevel = data & 0x7;
                this.SO2VolumeLevel = (data & 0x70) >> 4;
                this.vinSO1Enabled = (data & 0x8) !== 0;
                this.vinSO2Enabled = (data & 0x80) !== 0;
                return;
            case 0xff25:
                this.sound4ToSO2 = (data & (1 << 7)) !== 0;
                this.sound3ToSO2 = (data & (1 << 6)) !== 0;
                this.sound2ToSO2 = (data & (1 << 5)) !== 0;
                this.sound1ToSO2 = (data & (1 << 4)) !== 0;
                this.sound4ToSO1 = (data & (1 << 3)) !== 0;
                this.sound3ToSO1 = (data & (1 << 2)) !== 0;
                this.sound2ToSO1 = (data & (1 << 1)) !== 0;
                this.sound1ToSO1 = (data & (1 << 0)) !== 0;
                return;
            case 0xff26:
                this.soundEnabled = (data & 0x80) !== 0;
                if (this.isOn()) {
                    this.masterVolume.gain.value = 1;
                    // When powered on, the frame sequencer is reset so that the next step will be 0, 
                    this.step = -1;
                    // TODO: the square duty units are reset to the first step of the waveform

                    // the wave channel's sample buffer is reset to 0.
                    for (let i = 0xff30; i <= 0xff3f; i++) {
                        this.setByte(i, 0);
                    }
                } else {
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
            case 0xff24: return (
                (this.vinSO2Enabled ? 0x80 : 0) |
                (this.SO2VolumeLevel << 4) |
                (this.vinSO1Enabled ? 0x8 : 0) |
                (this.SO1VolumeLevel)
            );
            case 0xff25: return (
                (this.sound4ToSO2 ? 0x80 : 0) |
                (this.sound3ToSO2 ? 0x40 : 0) |
                (this.sound2ToSO2 ? 0x20 : 0) |
                (this.sound1ToSO2 ? 0x10 : 0) |
                (this.sound4ToSO1 ? 0x8 : 0) |
                (this.sound3ToSO1 ? 0x4 : 0) |
                (this.sound2ToSO1 ? 0x2 : 0) |
                (this.sound1ToSO1 ? 0x1 : 0)
            );
            case 0xff26:
                return (
                    (this.soundEnabled ? 0x80 : 0) |
                    (this.soundChannel1.isOn() ? 0x1 : 0) |
                    (this.soundChannel2.isOn() ? 0x2 : 0) |
                    (this.waveChannel.isOn() ? 0x4 : 0) |
                    (this.noiseChannel.isOn() ? 0x8 : 0)
                ) | 0x70;
        }
        return 0xff;
    }

    get SO1Volume() {
        return this.SO1VolumeLevel / 7;
    }

    get SO2Volume() {
        return this.SO2VolumeLevel / 7;
    }

    // When powered off, all registers (NR10-NR51) are instantly written with zero
    powerOff() {
        this.masterVolume.gain.value = 0;

        this.SO1VolumeLevel = 0;
        this.SO2VolumeLevel = 0;
        this.vinSO1Enabled = false;
        this.vinSO2Enabled = false;

        this.sound1ToSO1 = false;
        this.sound1ToSO2 = false;
        this.sound2ToSO1 = false;
        this.sound2ToSO2 = false;
        this.sound3ToSO1 = false;
        this.sound3ToSO2 = false;
        this.sound4ToSO1 = false;
        this.sound4ToSO2 = false;

        this.soundChannel1.powerOff();
        this.soundChannel2.powerOff();
        this.waveChannel.powerOff();
        this.noiseChannel.powerOff();
    }

    isOn(): boolean {
        return this.soundEnabled;
    }

    size() {
        return 0x30;
    }

}