import SoundUnit from "./SoundUnit";

export default class LengthCounter {

    private soundUnit: SoundUnit;
    public counter: number = 0;

    constructor(soundUint: SoundUnit) {
        this.soundUnit = soundUint;
    }

    tick() {
        if (this.soundUnit.isLengthCounterEnable() && this.counter !== 0) {
            this.counter -= 1;
            if (this.counter === 0) {
                this.soundUnit.setTrigger(false);
            }
        }
    }

    reload(counter: number) {
        this.counter = counter;
    }

}