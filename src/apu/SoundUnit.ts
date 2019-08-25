import LengthCounter from "./LengthCounter";

export default abstract class SoundUnit {

    private trigger: boolean = false;

    public abstract lengthCounter: LengthCounter;
    public abstract powerOff(): void;
    public abstract isLengthCounterEnable(): boolean;

    public setTrigger(trigger: boolean): void {
        this.trigger = trigger;
    }

    public isOn(): boolean {
        return this.trigger;
    }

}