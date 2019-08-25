import SoundUnit from "./SoundUnit";

export default class LengthCounter {

    private readonly soundUnit: SoundUnit;
    private readonly initialValue: number;
    public counter: number = 0;

    constructor(soundUint: SoundUnit, initialValue: number) {
        this.soundUnit = soundUint;
        this.initialValue = initialValue;
    }

    tick() {
        if (this.soundUnit.isLengthCounterEnable() && this.counter !== 0) {
            this.counter -= 1;
            if (this.counter === 0) {
                this.soundUnit.setTrigger(false);
            }
        }
    }

    reload(counter = 0) {
        this.counter = this.initialValue - counter;
    }

}