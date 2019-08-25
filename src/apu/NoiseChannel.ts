import { Register8 } from "../cpu/Register";
import LengthCounter from "./LengthCounter";
import SoundUnit from "./SoundUnit";

export default class NoiseChannel extends SoundUnit {

    private readonly audioCtx: AudioContext;

    private trigger: boolean = false;

    public readonly lengthCounter: LengthCounter = new LengthCounter(this); // 0xff20 - NR41
    private readonly volumeEnvelope: Register8 = new Register8(); // 0xff21 - NR42
    private readonly polynomialCounter: Register8 = new Register8(); // 0xff22 - NR43
    private readonly selectionRegister: Register8 = new Register8(); // 0xff23 - NR44

    constructor(audioCtx: AudioContext) {
        super();
        this.audioCtx = audioCtx;
    }

    setByte(address: number, data: number) {
        switch (address) {
            case 0xff20: return this.lengthCounter.reload((1 << 6) - (data & 0x3f));
            case 0xff21: return this.volumeEnvelope.set(data);
            case 0xff22: return this.polynomialCounter.set(data);
            case 0xff23:
                this.selectionRegister.set(data);
                this.trigger = (data & 0x80) !== 0;
                if (this.isOn()) {
                    if (this.lengthCounter.counter === 0 || !this.isLengthCounterEnable()) {
                        this.lengthCounter.reload(1 << 6);
                    }
                }
                return;
        }
    }

    getByte(address: number): number {
        switch (address) {
            case 0xff20: return 0xff;
            case 0xff21: return this.volumeEnvelope.get();
            case 0xff22: return this.polynomialCounter.get();
            case 0xff23: return this.selectionRegister.get() | 0xbf;
        }
        throw new Error('Unsupported SquareChannel register');
    }

    powerOff() {
        this.setByte(0xff20, 0);
        this.setByte(0xff21, 0);
        this.setByte(0xff22, 0);
        this.setByte(0xff23, 0);
    }

    setTrigger(trigger: boolean): void {
        this.trigger = trigger;
    }

    isOn(): boolean {
        return this.trigger;
    }

    isLengthCounterEnable(): boolean {
        return (this.selectionRegister.get() & 0x40) !== 0;
    }

    size() {
        return 4;
    }

}