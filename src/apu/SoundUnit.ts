import LengthCounter from "./LengthCounter";

export default abstract class SoundUnit {

    private readonly name: string;

    private dacPower: boolean = false; 
    private trigger: boolean = false; // NRX4 bit 7
    private lengthCounterEnabled: boolean = false; // NRX4 bit 6

    public abstract lengthCounter: LengthCounter;
    public abstract powerOff(): void;

    constructor(name: string) {
        this.name = name;
    }

    public setTriggerAndLengthCounter(data: number) {
        if (!this.isOn() && this.isDACOn()) {
            this.setTrigger((data & 0x80) !== 0);
        }
        this.setLengthCounterEnable((data & 0x40) !== 0);
        if (this.isOn()) {
            if (this.lengthCounter.counter === 0) {
                this.lengthCounter.reload();
            }
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

}