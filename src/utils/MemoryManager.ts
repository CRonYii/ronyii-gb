import { Memory } from "../memory/Memory";

export type MemoryAttribute<T extends string> = {
    [key in T]: number
}

export default class MemoryManager<T extends string> {

    private readonly memory: Memory;
    private readonly memoryAttributes: MemoryAttribute<T>;

    constructor(memory: Memory, memoryAttributes: MemoryAttribute<T>) {
        this.memory = memory;
        this.memoryAttributes = memoryAttributes;
    }

    setByte(key: T, value: number) {
        const address = this.memoryAttributes[key];

        this.memory.setByte(address, value);
    }

    getByte(key: T): number {
        const address = this.memoryAttributes[key];

        return this.memory.getByte(address);
    }

}