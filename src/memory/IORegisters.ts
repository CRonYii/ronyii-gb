export const IORegisterControls = {
    'LCDC': 0xff40,
    'STAT': 0xff41,
    'SCY': 0xff42,
    'SCX': 0xff43,
    'LY': 0XFF44,
    'LYC': 0XFF45,
    'DMA': 0XFF46,
    'BGP': 0XFF47,
    'OBP0': 0XFF48,
    'OBP1': 0XFF49,
    'WY': 0XFF4A,
    'WX': 0XFF4B,
}

export type IORegisterControlsKeys = keyof typeof IORegisterControls;