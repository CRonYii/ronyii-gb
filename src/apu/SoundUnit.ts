import LengthCounter from "./LengthCounter";
import { CPU_CLOCK_SPEED } from "../constants/index";
import { Memory } from "../memory/Memory";
import Timer from "../utils/Timer";

export default abstract class SoundUnit implements Memory {
    
    public readonly name: string;
    
    private readonly audioCtx: AudioContext;
    protected readonly buffer: AudioBuffer;
    private outputAudioNode: AudioBufferSourceNode;

    private bufferOffset: number = 0;
    private started: boolean = false;
    
    private readonly sampleTimer: Timer;

    private dacPower: boolean = false;
    private trigger: boolean = false; // NRX4 bit 7
    private lengthCounterEnabled: boolean = false; // NRX4 bit 6

    public constructor(name: string, audioCtx: AudioContext) {
        this.name = name;
        this.audioCtx = audioCtx;
        this.outputAudioNode = this.audioCtx.createBufferSource();
        // 1 output channel, 1 seconds duration
        this.buffer = this.audioCtx.createBuffer(1, this.audioCtx.sampleRate, this.audioCtx.sampleRate);

        this.sampleTimer = new Timer(Math.floor(CPU_CLOCK_SPEED /  this.audioCtx.sampleRate));
    }

    public tick(cycles: number) {
        const times = this.sampleTimer.tick(cycles);
        if (times > 0) {
            const amp = this.sample();
            this.setAudioBuffer(times, amp);
        }
    }

    protected setAudioBuffer(duration: number, amplitude: number) {
        this.start();
        const buffer = this.buffer.getChannelData(0);
        if (this.bufferOffset >= buffer.length) {
            return;
        }
        const spaceLeft = buffer.length - this.bufferOffset;
        if (duration > spaceLeft) {
            duration = spaceLeft;
        }
        buffer.set(new Array(duration).fill(amplitude), this.bufferOffset);
        this.bufferOffset += duration;
    }

    private refreshBuffer() {
        // clear the buffer
        this.buffer.getChannelData(0).fill(0);
        this.bufferOffset = 0;
        // create a new buffer source to play audio for 1 seconds
        this.outputAudioNode = this.audioCtx.createBufferSource();
        this.outputAudioNode.buffer = this.buffer;
        this.outputAudioNode.onended = () => {
            // when the whole buffer has been played (1 seconds long),
            // disconnect and refresh the buffer to store audio data for the next seconds
            this.outputAudioNode.disconnect();
            this.refreshBuffer();
        };
        // connect the output audio node and start playing
        this.outputAudioNode.start();
    }

    public start() {
        if (!this.started) {
            this.refreshBuffer();
            this.started = true;
        }
    }

    public setTriggerAndLengthCounter(data: number) {
        if (!this.isOn() && this.isDACOn()) {
            this.setTrigger((data & 0x80) !== 0);
        }
        this.setLengthCounterEnable((data & 0x40) !== 0);
        if (this.isOn()) {
            this.reload();
        }
    }

    public reload() {
        if (this.lengthCounter.counter === 0) {
            this.lengthCounter.reload();
        }
    }

    public setPower(power: boolean): void {
        if (power === false) {
            this.setTrigger(false);
        }
        this.dacPower = power;
    }

    public isDACOn(): boolean {
        return this.dacPower;
    }

    public setTrigger(trigger: boolean): void {
        this.trigger = trigger;
    }

    public isOn(): boolean {
        return this.trigger;
    }

    public setLengthCounterEnable(flag: boolean): void {
        this.lengthCounterEnabled = flag;
    }

    public isLengthCounterEnable(): boolean {
        return this.lengthCounterEnabled;
    }

    public getOuputNode(): AudioNode {
        return this.outputAudioNode;
    }

    public abstract lengthCounter: LengthCounter;
    public abstract sample(): number;
    public abstract powerOff(): void;
    public abstract setByte(address: number, data: number): void;
    public abstract getByte(address: number): number;
    public abstract size(): number;

}