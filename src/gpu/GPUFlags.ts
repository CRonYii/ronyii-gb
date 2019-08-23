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

export const LCDCManager = () => new FlagManager<LCDCFlagsKey>(LCDCFlags);

const STATFlags = {
    'coincidence': 2,
    'mode00_interrupt': 3,
    'mode01_interrupt': 4,
    'mode10_interrupt': 5,
    'coincidence_interrupt': 6,
};

export type STATFlagsKey = keyof typeof STATFlags;

export const STATManager = () => new FlagManager<STATFlagsKey>(STATFlags);