import { CARTRIDGE_TYPE, RAM_BANKS, ROM_BANKS, TITLE_END, TITLE_START } from "../constants/index";
import Helper from "../utils/Helper";
import { Memory, MemorySegment } from "../memory/Memory";

export default abstract class Cartridge implements Memory {

    protected rom: Uint8Array;
    protected abstract ram: Memory;

    public readonly title: string;
    public readonly type: number;
    public readonly romBanks: number;
    public readonly ramBanks: number;

    constructor(rom: ArrayLike<number>) {
        // load the rom data into memory
        this.rom = new Uint8Array(rom.length);
        this.rom.set(rom);

        // retrives info from cartridge header
        this.title = Helper.toText(this.rom, TITLE_START, TITLE_END);
        this.type = this.rom[CARTRIDGE_TYPE];
        this.romBanks = this.rom[ROM_BANKS];
        this.ramBanks = this.rom[RAM_BANKS];
    }

    setByte(address: number, data: number): void {
        if (address <= 0x7FFF) {
            this.setChipRegister(address, data);
        } else {
            this.setRAMByte(address, data);
        }
    };

    getByte(address: number): number {
        if (address <= 0x3FFF) {
            return this.rom[address];
        } else if (address <= 0x7FFF) {
            return this.getROMByte(address - 0x4000);
        } else {
            return this.getRAMByte(address);
        }
    }

    abstract setChipRegister(address: number, value: number): void;
    abstract setRAMByte(address: number, value: number): void;
    abstract getROMByte(address: number): number;
    abstract getRAMByte(address: number): number;

    size(): number {
        return this.rom.length;
    }

}

export class NoneMBCCartridge extends Cartridge {

    protected ram = new MemorySegment({ size: 0x2000, offset: 0xA000, readable: true, writable: true });

    setChipRegister(address: number, data: number): void {
        // No MBC chip, cannot write to cartridge
    }

    setRAMByte(address: number, value: number): void {
        this.ram.setByte(address, value);
    }

    getROMByte(address: number): number {
        return this.rom[address + 0x4000];
    }

    getRAMByte(address: number): number {
        return this.ram.getByte(address);
    }

}