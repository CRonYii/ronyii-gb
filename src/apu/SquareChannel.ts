import LengthCounter from "./LengthCounter";
import SoundUnit from "./SoundUnit";
import Sweep from "./Sweep";
import VolumeEnvelope from "./VolumeEnvelope";

export default class SquareChannel extends SoundUnit {

    private readonly audioCtx: AudioContext;
    private readonly osc: OscillatorNode;
    private readonly gainNode: GainNode;
    private readonly useSweep: boolean;

    public readonly lengthCounter: LengthCounter = new LengthCounter(this, 1 << 6);
    public readonly volumeEnvelope: VolumeEnvelope = new VolumeEnvelope(); // 0xff12 - NR12 / 0xff17 - NR22
    public readonly sweep = new Sweep(this); // 0xff10 - NR10

    private wavePattern: number = 0;
    private frequency: number = 0; 

    constructor(audioCtx: AudioContext, useSweep: boolean) {
        super(useSweep ? "Sound Channel 1" : "Sound Channel 2");
        this.useSweep = useSweep;
        this.audioCtx = audioCtx;
        this.osc = audioCtx.createOscillator();
        this.osc.type = 'square';
        this.gainNode = audioCtx.createGain();
        this.gainNode.gain.value = 0;
        this.osc.connect(this.gainNode);
        this.osc.start();
    }

    setByte(address: number, data: number) {
        switch (address) {
            case 0x0: return this.sweep.set(data);
            case 0x1:
                this.wavePattern = (data & 0xc0) >> 6;
                this.lengthCounter.reload(data & 0x3f);
                return;
            case 0x2:
                this.volumeEnvelope.set(data);
                this.setPower((data & 0xf8) !== 0);
                return;
            case 0x3: return this.frequency = (this.frequency & 0x700) | data;
            case 0x4:
                this.frequency = (this.frequency & 0xff) | ((data & 0b111) << 8);
                this.setTriggerAndLengthCounter(data);
                return;
        }
    }

    getByte(address: number): number {
        switch (address) {
            case 0x0: return this.useSweep ? this.sweep.get() | 0x80 : 0xff;
            case 0x1: return (this.wavePattern << 6) | 0x3f;
            case 0x2: return this.volumeEnvelope.get();
            case 0x3: return 0xff;
            case 0x4: return (this.isLengthCounterEnable() ? 0x40 : 0) | 0xbf;
        }
        throw new Error('Unsupported SquareChannel register');
    }

    public reload() {
        super.reload();
        this.volumeEnvelope.reload();
        this.sweep.reload();
    }

    powerOff() {
        this.setByte(0x0, 0);
        this.setByte(0x1, 0);
        this.setByte(0x2, 0);
        this.setByte(0x3, 0);
        this.setByte(0x4, 0);
    }

    setFrequency(frequency: number) {
        this.frequency = frequency;
    }

    getFrequency() {
        return this.frequency;
    }

    getOuputNode(): AudioNode {
        return this.gainNode;
    }

    size() {
        return 5;
    }

}