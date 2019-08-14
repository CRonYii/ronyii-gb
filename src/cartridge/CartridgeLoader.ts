import Cartridge, { NoneMBCCartridge } from "./Cartridge";
import { CARTRIDGE_TYPE } from "../constants/index";
import MBC1 from "./MBC1";

export const loadCartridge = (rom: ArrayLike<number>): Cartridge => {
    switch (rom[CARTRIDGE_TYPE]) {
        case 0x00:
            return new NoneMBCCartridge(rom);
        case 0x01:
            return new MBC1(rom);
        default:
            throw new Error('Unsupported Cartridge type => ' + rom[CARTRIDGE_TYPE]);
    }
};