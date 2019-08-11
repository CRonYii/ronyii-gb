import { Register } from "./Register";
import { NUM_BYTES_CPU } from "../constants/index";
import { ByteBufferable } from "../utils/ByteBuffer";

export default class Register8 extends Register {

    constructor(initialValue?: ByteBufferable) {
        super({ size: NUM_BYTES_CPU, initialValue });
    }

}