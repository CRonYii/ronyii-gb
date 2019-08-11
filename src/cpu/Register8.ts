import { Register } from "./Register";
import { NUM_BYTES_CPU } from "../constants/index";

export default class Register8 extends Register {

    constructor() {
        super({ size: NUM_BYTES_CPU });
    }

    byte(): number {
        return this._data[0];
    }

}