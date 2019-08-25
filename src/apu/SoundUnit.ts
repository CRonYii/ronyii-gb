import LengthCounter from "./LengthCounter";

export default abstract class SoundUnit {

    public abstract lengthCounter: LengthCounter;
    public abstract powerOff(): void;
    public abstract isOn(): boolean;
    public abstract isLengthCounterEnable(): boolean;
    public abstract setTrigger(trigger: boolean): void;

}