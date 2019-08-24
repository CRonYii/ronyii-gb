import Cartridge from "./Cartridge";
import { MemorySegment } from "../memory/Memory";

// Memory Bank Controller
export default class MBC1 extends Cartridge {

    static ROM_BANK_SIZE = 0x4000;
    static RAM_BANK_SIZE = 0x2000;

    protected ram = new MemorySegment({ size: 0x8000, offset: 0xA000, readable: true, writable: true });

    private ramEnabled: boolean = false;
    private romBank: number = 1;
    private ramBank: number = 0;
    private mode: number = 0;

    setChipRegister(address: number, data: number) {
        if (address < 0x2000) {
            this.setRamEnabled(data);
        } else if (address < 0x4000) {
            this.setRomBank(data);
        } else if (address < 0x6000) {
            this.setRamBank(data);
        } else if (address < 0x8000) {
            this.setMode(data);
        }
    }

    setRAMByte(address: number, data: number) {
        if (this.ramEnabled) {
            this.ram.setByte(this.ramOffset + address, data);
        }
    }

    getROMByte(address: number): number {
        if (address <= 0x3fff) {
            let offset = 0;
            if (this.mode === 1) {
                offset |= this.ramBank << 5;
            }
            offset = (offset % this.romBanks) * MBC1.ROM_BANK_SIZE;
            return this.rom[offset + address];
        } else {
            return this.rom[this.romOffset + (address - 0x4000)];
        }
    }

    getRAMByte(address: number): number {
        if (this.ramEnabled) {
            return this.ram.getByte(this.ramOffset + address);
        }
        return 0xFF;
    }

    private get romOffset() {
        let offset = this.romBank;
        offset |= (this.ramBank << 5);
        return (offset % this.romBanks) * MBC1.ROM_BANK_SIZE;
    }

    private get ramOffset() {
        if (this.mode === 0) {
            return 0x0000;
        } else {
            return (this.ramBank % this.ramBanks) * MBC1.RAM_BANK_SIZE;
        }
    }

    private setRamEnabled(value: number) {
        value &= 0x0f;
        this.ramEnabled = value === 0x0A;
    }

    private setRomBank(value: number) {
        value &= 31; // 5 bits
        if (value === 0) {
            value = 1
        };
        this.romBank = value;
    }

    private setRamBank(value: number) {
        value &= 3; // 2 bits
        this.ramBank = value;
    }

    private setMode(value: number) {
        value &= 0b1;
        this.mode = value;
    }

}