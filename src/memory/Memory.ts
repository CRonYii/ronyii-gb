import { ByteBuffer, byteBuffer } from "../utils/ByteBuffer";

export interface MemoryOptions {
    size: number,
    controllers?: MemoryController[]
}

export interface MemoryController {
    start: number,
    end: number,
    set: (mem: Memory, address: number, byte: number) => void,
    defaultValues?: Uint8Array
}

export class Memory {

    private readonly _data: ByteBuffer;

    private readonly _size: number;

    private readonly memoryControllers: MemoryController[] = [];

    constructor(options: MemoryOptions) {
        const { size, controllers } = options;
        this._size = size;
        this._data = byteBuffer.from(0, size);
        if (controllers) {
            for (let controller of controllers) {
                this.addController(controller);
            }
        }
    }

    public set(address: number, data: number) {
        const controller = this.getController(address);
        if (controller) {
            controller.set(this, address, data);
        }
        this._data[address] = data;
    }

    public get(address: number) {
        return this._data[address];
    }

    private getController(address: number): MemoryController | undefined {
        for (let controller of this.memoryControllers) {
            if (address >= controller.start && address <= controller.end) {
                return controller;
            }
        }
    }

    private addController(controller: MemoryController) {
        const { start, end, defaultValues } = controller;
        if (!this.accepts(start) || !this.accepts(end)) {
            throw new Error(`Unacceptable memory controller range ${start} ~ ${end}`);
        }
        if (defaultValues) {
            const size = end - start + 1;
            if (defaultValues.length !== size) {
                throw new Error(`Incompatiable default value size, expect ${size} but got ${defaultValues.length}`);
            }
            this._data.set(defaultValues, start);
        }
        this.memoryControllers.push(controller);
    }

    public accepts(address: number): boolean {
        return address >= 0 && address < this._size;
    }

    /**
     * Returns the number of bytes that can be stored in the memory.
     */
    public size() {
        return this._size;
    }
}