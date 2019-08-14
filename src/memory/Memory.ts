import { ByteBuffer, byteBuffer, ByteBufferable } from "../utils/ByteBuffer";
import Helper from "../utils/Helper";
import { debugEnabled } from "../index";

export interface MemoryOptions {
    size: number,
    controllers?: MemoryController[],
    debuggerConfig?: MemoryDebuggerConfig
}

export class Memory {

    private readonly _data: ByteBuffer;

    private readonly _size: number;

    private readonly memoryControllers: MemoryController[] = [];
    private readonly debuggerConfig?: MemoryDebuggerConfig;

    constructor(options: MemoryOptions) {
        const { size, controllers, debuggerConfig } = options;
        this._size = size;
        this._data = byteBuffer.from(0, size);
        this.debuggerConfig = debuggerConfig;
        if (controllers) {
            for (let controller of controllers) {
                this.addController(controller);
            }
        }
    }

    public setByte(address: number, data: number) {
        const controller = this.getController(address);
        if (controller) {
            controller.set(this, address, data);
        }
        this._data[address] = data;
        this.debug(address, data);
    }

    private debug(address: number, data: number) {
        if (debugEnabled.printMemory) {
            if (this.debuggerConfig) {
                for (let bp of this.debuggerConfig.breakpoints) {
                    switch (bp.type) {
                        case 'ADDR':
                            if (address !== bp.value) {
                                continue;
                            }
                            break;
                        case 'VAL':
                            if (data !== bp.value) {
                                continue;
                            }
                            break;
                    }
                    this.debuggerConfig.debugger(this, address, data);
                }
            }
        }
    }

    public getByte(address: number): number {
        return this._data[address];
    }

    public set(address: number, numBytes: number, data: ByteBufferable) {
        const values = byteBuffer.from(data, numBytes);
        for (let i = 0; i < numBytes; i++) {
            this.setByte(address + i, values[i]);
        }
    }

    public get(address: number, numBytes: number) {
        return this._data.slice(address, address + numBytes);
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
            if (defaultValues.length >= size) {
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

type BreakPointType = 'ADDR' | 'VAL';

interface Breakpoint {
    type: BreakPointType,
    value: number
};

type MemoryDebugger = (cpu: Memory, address: number, value: number) => void;

export interface MemoryDebuggerConfig {
    breakpoints: Breakpoint[],
    debugger: MemoryDebugger
}

export interface MemoryController {
    start: number,
    end: number,
    set: (mem: Memory, address: number, byte: number) => void,
    defaultValues?: Uint8Array
}