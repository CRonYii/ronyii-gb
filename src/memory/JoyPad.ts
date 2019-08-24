import { Memory } from "./Memory";
import { InterruptFlagsEKey } from "./IORegisters";
import FlagManager from "../utils/FlagManager";

export class JoyPad implements Memory {

    static START = 13;
    static SELECT = 32;
    static LEFT_ARROW = 37;
    static UP_ARROW = 38;
    static RIGHT_ARROW = 39;
    static DOWN_ARROW = 40;
    static A = 90;
    static B = 88;

    private readonly interruptFlagsManager: FlagManager<InterruptFlagsEKey>;

    private keySelection: number = 0;
    private directionKeys: number = 0xf;
    private buttonKeys: number = 0xf;

    constructor(interruptFlagsManager: FlagManager<InterruptFlagsEKey>) {
        this.interruptFlagsManager = interruptFlagsManager;
        window.addEventListener('keydown', this.keydown);
        window.addEventListener('keyup', this.keyup);
    }

    keydown = (evt: KeyboardEvent) => {
        this.interruptFlagsManager.set('Joypad', true);

        switch (evt.keyCode) {
            case JoyPad.DOWN_ARROW: return this.directionKeys &= 0x7;
            case JoyPad.UP_ARROW: return this.directionKeys &= 0xB;
            case JoyPad.LEFT_ARROW: return this.directionKeys &= 0xD;
            case JoyPad.RIGHT_ARROW: return this.directionKeys &= 0xE;
            case JoyPad.START: return this.buttonKeys &= 0x7;
            case JoyPad.SELECT: return this.buttonKeys &= 0xB;
            case JoyPad.B: return this.buttonKeys &= 0xD;
            case JoyPad.A: return this.buttonKeys &= 0xE;
        }
    }

    keyup = (evt: KeyboardEvent) => {
        switch (evt.keyCode) {
            case JoyPad.DOWN_ARROW: return this.directionKeys |= 0x8;
            case JoyPad.UP_ARROW: return this.directionKeys |= 0x4;
            case JoyPad.LEFT_ARROW: return this.directionKeys |= 0x2;
            case JoyPad.RIGHT_ARROW: return this.directionKeys |= 0x1;
            case JoyPad.START: return this.buttonKeys |= 0x8;
            case JoyPad.SELECT: return this.buttonKeys |= 0x4;
            case JoyPad.B: return this.buttonKeys |= 0x2;
            case JoyPad.A: return this.buttonKeys |= 0x1;
        }
    }

    setByte(address: number, data: number): void {
        this.keySelection = data & 0x30;
    }

    getByte(address: number): number {
        if ((this.keySelection & 0x10) === 0) {
            return this.keySelection | this.directionKeys;
        } else if ((this.keySelection & 0x20) === 0) {
            return this.keySelection | this.buttonKeys;
        }
        return this.keySelection;
    }

    size(): number {
        return 1;
    }

}