import Helper from "../utils/Helper";
import { TITLE_START, TITLE_END, CARTRIDGE_TYPE, GAMEBOY_TYPE, ROM_BANKS, RAM_BANKS } from "../constants/index";
import { Memory } from "./Memory";

const getROMmeta = (rom: Uint8Array) => {
    const title = Helper.toText(rom, TITLE_START, TITLE_END);
    const cartridgeType = rom[CARTRIDGE_TYPE];
    const gameboyType = rom[GAMEBOY_TYPE];
    const romBanks = rom[ROM_BANKS];
    const ramBanks = rom[RAM_BANKS];
    return { title, cartridgeType, gameboyType, romBanks, ramBanks };
}

export default class Cartridge implements Memory {

    private rom: Uint8Array;

    constructor(rom: Uint8Array) {
        this.rom = rom;
    }

    setByte(address: number, data: number) {
        // ROM is read-only
    }

    getByte(address: number): number {
        return this.rom[address];
    }

    size(): number {
        return 0;
    }

}