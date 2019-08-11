import { ByteBufferable, ByteBuffer } from "../utils/ByteBuffer";
import { Register } from "./Register";
import { Register16 } from "./Register16";

export class InnerRegister8 extends Register {
    
    constructor(buffer: ByteBuffer, offset: number) {
        super({
            size: 1,
            offset,
            buffer
        });
    }

}

export class CombinedRegister extends Register16 {

    public readonly low = new InnerRegister8(this._data, 1);
    public readonly high = new InnerRegister8(this._data, 0);

    constructor(initialValue?: ByteBufferable) {
        super(initialValue);
    }

}