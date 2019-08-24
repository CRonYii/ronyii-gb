import { CARTRIDGE_TYPE, RAM_BANKS, ROM_BANKS, TITLE_END, TITLE_START } from "../constants/index";
import Helper from "../utils/Helper";
import { Memory, MemorySegment } from "../memory/Memory";

export default abstract class Cartridge implements Memory {

    static ROM_BANKS: any = {
        0x0: 2,
        0x1: 4,
        0x2: 8,
        0x3: 16,
        0x4: 32,
        0x5: 64,
        0x6: 128,
        0x7: 256,
        0x8: 512,
        0x52: 72,
        0x53: 80,
        0x54: 96
    };

    static RAM_BANKS: any = {
        0x0: 0,
        0x1: 1,
        0x2: 1,
        0x3: 4,
        0x4: 16,
        0x5: 8
    };

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
        this.romBanks = Cartridge.ROM_BANKS[this.rom[ROM_BANKS]];
        this.ramBanks = Cartridge.RAM_BANKS[this.rom[RAM_BANKS]];
    }

    setByte(address: number, data: number): void {
        if (address <= 0x7FFF) {
            this.setChipRegister(address, data);
        } else if (this.ramBanks > 0) {
            this.setRAMByte(address, data);
        }
    };

    getByte(address: number): number {
        if (address <= 0x7FFF) {
            return this.getROMByte(address);
        } else if (this.ramBanks > 0) {
            return this.getRAMByte(address);
        }
        return 0xff;
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
        return this.rom[address];
    }

    getRAMByte(address: number): number {
        return this.ram.getByte(address);
    }

}