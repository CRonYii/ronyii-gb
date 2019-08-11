import Helper from "../utils/Helper";
import { TITLE_START, TITLE_END, CARTRIDGE_TYPE, GAMEBOY_TYPE, ROM_BANKS, RAM_BANKS } from "../constants/index";

const loadROM = (rom: Uint8Array) => {
    const title = Helper.toText(rom, TITLE_START, TITLE_END);
    const cartridgeType = rom[CARTRIDGE_TYPE];
    const gameboyType = rom[GAMEBOY_TYPE];
    const romBanks = rom[ROM_BANKS];
    const ramBanks = rom[RAM_BANKS];
    console.log({ title, cartridgeType, gameboyType, romBanks, ramBanks });
}

export default loadROM;