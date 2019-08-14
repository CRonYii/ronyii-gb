
export interface Memory {
    setByte: (address: number, data: number) => void,
    getByte: (address: number) => number,
    size(): number,
}

export interface MemoryOptions {
    size: number,
    offset?: number,
    readable?: boolean,
    writable?: boolean,
    defaultValues?: ArrayLike<number>
}

export class MemorySegment implements Memory {

    private readonly data: Uint8Array;

    private readonly _size: number;
    private readonly offset: number;
    private readonly readable: boolean;
    private readonly writable: boolean;


    constructor(options: MemoryOptions) {
        const { size, offset = 0, readable = true, writable = false, defaultValues } = options;
        this._size = size;
        this.offset = offset;
        this.readable = readable;
        this.writable = writable;
        this.data = new Uint8Array(size);
        if (defaultValues) {
            this.data.set(defaultValues);
        }
    }

    public setByte(address: number, data: number) {
        if (this.writable) {
            this.data[address - this.offset] = data;
        }
    }

    public getByte(address: number): number {
        if (this.readable) {
            return this.data[address - this.offset];
        }
        return 0xFF;
    }

    /**
     * Returns the number of bytes that can be stored in the memory.
     */
    public size() {
        return this._size;
    }

}