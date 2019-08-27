import LengthCounter from "./LengthCounter";
import SoundUnit from "./SoundUnit";
import Sweep from "./Sweep";
import VolumeEnvelope from "./VolumeEnvelope";
import Timer from "../utils/Timer";

export default class SquareChannel extends SoundUnit {

    static WAVEFORMS = [
        0b0000_0001,
        0b1000_0001,
        0b1000_0111,
        0b0111_1110,
    ];

    private readonly timer: Timer = new Timer(8192);

    private readonly useSweep: boolean;

    public readonly lengthCounter: LengthCounter = new LengthCounter(this, 1 << 6);
    public readonly volumeEnvelope: VolumeEnvelope = new VolumeEnvelope(); // 0xff12 - NR12 / 0xff17 - NR22
    public readonly sweep = new Sweep(this); // 0xff10 - NR10

    private wavePattern: number = 0;
    private frequency: number = 0;
    private waveIndex: number = 0;

    constructor(audioCtx: AudioContext, useSweep: boolean) {
        super(useSweep ? "Sound Channel 1" : "Sound Channel 2", audioCtx);
        this.useSweep = useSweep;
    }

    tick(cycles: number) {
        const times = this.timer.tick(cycles);
        const waveForm = SquareChannel.WAVEFORMS[this.wavePattern];
        const volume = this.volumeEnvelope.getVolume();
        for (let i = 0; i < times; i++) {
            let amplitude = 0;
            if (this.isOn() && volume != 0) {
                amplitude = volume;
            }
            // 1 for positive amplitude, 0 for negative amplitude
            if (((waveForm >> this.waveIndex) & 0b1) === 0) {
                amplitude *= -1;
            }
            this.setAudioBuffer(this.timer.period, amplitude);
            this.waveIndex = (this.waveIndex + 1) % 8;
        }
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
            case 0x3: return this.setFrequency((this.frequency & 0x700) | data);
            case 0x4:
                this.setFrequency((this.frequency & 0xff) | ((data & 0b111) << 8));
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

    private adjustTimerPeriod() {
        this.timer.period = 4 * (2048 - this.frequency);
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
        this.adjustTimerPeriod();
    }

    getFrequency() {
        return this.frequency;
    }

    size() {
        return 5;
    }

}