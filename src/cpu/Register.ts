import Helper from "../utils/Helper";

export interface RegisterOptions {
    size: number;
}

export interface Register {
    set(value: number): void,
    get(): number,
    size(): number
}

export class NumberRegister implements Register {

    static BIT_MASKS = [
        0xff,
        0xffff,
        0xffffff,
        0xffffffff
    ];

    /** the data container of the register */
    protected data: number = 0;

    /** the number of bytes the register can store. Maximum 4 bytes */
    protected readonly _size: number;

    protected readonly bitmask: number;

    public constructor(options: RegisterOptions) {
        const { size } = options;
        if (size < 1 || size > 4) {
            throw new Error('NumberRegister can only hold 4 bytes maximum');
        }
        this._size = size;
        this.bitmask = NumberRegister.BIT_MASKS[size - 1];
    }

    public set(value: number) {
        this.data = value & this.bitmask;
    }

    /**
     * Returns a copy of the ByteBuffer stored in the register.
     */
    public get(): number {
        return this.data;
    }

    /**
     * Returns the number of bytes that can be stored in the register.
     */
    public size() {
        return this._size;
    }

    public inc(): boolean {
        this.data++;
        let overflow = false;
        if (this.data > this.bitmask) {
            overflow = true;
            this.data = 0;
        }
        return overflow;
    }

    public dec(): boolean {
        this.data--;
        let overflow = false;
        if (this.data < 0) {
            overflow = true;
            this.data = this.bitmask;
        }
        return overflow;
    }

}

export class Register8 extends NumberRegister {

    constructor() {
        super({ size: 1 });
    }

}

export class Register16 extends NumberRegister {

    constructor() {
        super({ size: 2 });
    }

}