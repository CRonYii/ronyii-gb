import ALU from "../cpu/ALU";
import Timer from "../utils/Timer";

export default class VolumeEnvelope {

    private timer: Timer = new Timer(8);
    public volume: number = 0;
    public initialVolume: number = 0;
    public direction: number = 0;
    public period: number = 0;

    /**
     * A volume envelope has a volume counter and an internal timer clocked at 64 Hz by the frame sequencer.
     * When the waveform input is zero the envelope outputs zero, otherwise it outputs the current volume.
     */
    tick() {
        // When the timer generates a clock and the envelope period is not zero
        if (this.timer.tick(1) !== 0 && this.period !== 0) {
            // a new volume is calculated 
            this.calculateVolume();
        }
    }

    private calculateVolume() {
        let v = this.volume;
        // volume is calculated by adding or subtracting (as set by NRx2) one from the current volume.
        if (this.direction === 1) { // addition
            v = ALU.add8(v, 1).result;
        } else if (this.direction === 0) { // subtraction
            v = ALU.sub8(v, 1).result;
        }
        // If this new volume within the 0 to 15 range, the volume is updated,
        // otherwise it is left unchanged and
        // no further automatic increments/decrements are made to the volume until the channel is triggered again.
        if (v <= 15) {
            this.volume = v;
        }
    }

    reload() {
        // timer treats 0 as 8
        this.timer.period = this.period !== 0 ? this.period : 8;
        this.volume = this.initialVolume;
    }

    /**
     * NRx2
     * Bit 7-4 - Initial Volume of envelope (0-0Fh) (0=No Sound)
     * Bit 3   - Envelope Direction (0=Decrease, 1=Increase)
     * Bit 2-0 - Number of envelope sweep (n: 0-7)
     *           (If zero, stop envelope operation.)
     */
    set(data: number) {
        this.initialVolume = (data & 0xf0) >> 4;
        this.direction = (data & 0x8) >> 3;
        this.period = (data & 0b111);
    }

    get(): number {
        return (this.initialVolume << 4) | (this.direction << 3) | this.period;
    }

}