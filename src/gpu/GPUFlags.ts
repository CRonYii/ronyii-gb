import FlagManager, { FlagControl } from "../utils/FlagManager";

const LCDCFlags = {
    'bg_on': 0,
    'obj_on': 1,
    'obj_size': 2,
    'bg_map_base': 3,
    'bg_tile_base': 4,
    'lcd_on': 7,
};

export type LCDCFlagsKey = keyof typeof LCDCFlags;

export const LCDCManager = (flagControl: FlagControl) => new FlagManager<LCDCFlagsKey>(flagControl, LCDCFlags);