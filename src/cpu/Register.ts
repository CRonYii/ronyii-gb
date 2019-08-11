import { ByteBuffer, byteBuffer, ByteBufferable } from "../utils/ByteBuffer";

export interface RegisterOptions {
    size: number;
    offset?: number;
    initialValue?: ByteBufferable,
    buffer?: ByteBuffer
}

export class Register {

    /** the data container of the register,
     * each element in the array represents one byte.
     */
    protected readonly _data: ByteBuffer;

    /** the number of bytes the register can store. */
    protected readonly _size: number;

    /** the offset indicates the starting index of the _data ByteBuffer */
    protected readonly _offset: number;

    public readonly usingOutsideBuffer: boolean = false;

    public constructor(options: RegisterOptions) {
        const { size, initialValue, offset = 0, buffer } = options;
        if (isNaN(offset) || offset < 0 ||
            isNaN(size) || (buffer ? buffer.length : size) <= offset) {
            throw new Error(`Invalid size and/or offset. [size=${size}, offset=${offset}]`);
        }
        this._size = size;
        this._offset = offset;
        if (buffer) {
            this._data = buffer;
            this.usingOutsideBuffer = true;
        } else {
            this._data = this.toByteBuffer(initialValue || 0);
        }
    }

    public set(value: ByteBufferable) {
        const data: ByteBuffer = this.toByteBuffer(value);
        this._data.set(data, this._offset);
    }

    /**
     * A helper function to convert ByteBufferable to a ByteBuffer
     * @param data anything that can be converted to ByteBuffer
     */
    public toByteBuffer(data: ByteBufferable): ByteBuffer {
        if (typeof data === 'string' || typeof data === 'number') {
            data = byteBuffer.from(data, this._size);
        } else if (data instanceof Register) {
            data = data.data();
        }
        if (!this.compatible(data)) {
            throw new Error('incompatible register size');
        }
        return data;
    }

    /**
     * Determine whether or not the register is compatible 
     * to perform arithmetic operation with the BifBuffer.
     * @param buffer The ByteBuffer to be compare with
     */
    public compatible(buffer: ByteBuffer): boolean {
        return this._size === buffer.length;
    }

    /**
     * Returns a copy of the ByteBuffer stored in the register.
     */
    public data(): ByteBuffer {
        return this._data.slice(this._offset, this._offset + this._size);
    }

    /**
     * Returns the number of bytes that can be stored in the register.
     */
    public size() {
        return this._size;
    }

    /**
     * Returns the offset of the register.
     */
    public offset() {
        return this._offset;
    }

}