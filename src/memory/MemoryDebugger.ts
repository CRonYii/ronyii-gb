import Helper from "../utils/Helper";

export interface MemoryDebuggerConfig {
    breakpoints: Breakpoint[],
    debugger: MemoryDebugger
}

export type BreakPointType = 'ADDR' | 'VAL';

export interface Breakpoint {
    type: BreakPointType,
    value: number
};

export type MemoryDebugger = (address: number, value: number) => void;

export const memorydebuggerConfig: MemoryDebuggerConfig = {
    debugger: (address, data) => {
        console.log(`${Helper.toHexText(address, 4)} => ${Helper.toHexText(data, 2)}`);
    },
    breakpoints: [
        // { type: 'ADDR', value: 0xff40 }
    ],
};