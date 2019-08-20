import Helper from "../utils/Helper";
import { emulator } from "../index";

export interface MemoryDebuggerConfig {
    breakpoints: Breakpoint[],
    debugger: MemoryDebugger
}

export type BreakPointType = 'ADDR' | 'VAL';

export interface Breakpoint {
    type: BreakPointType,
    value: any,
    pasue?: boolean
};

export type MemoryDebugger = (address: number, value: number) => void;

let line = '';

export const memorydebuggerConfig: MemoryDebuggerConfig = {
    debugger: (address, data) => {
        if (address === 0xff01) {
            if (data === 10) {
                if (line.trim().length !== 0) {
                    console.log(line);
                }
                line = '';
            } else {
                line += String.fromCharCode(data);
            }
        } else if (address === 0xff43) {
            console.log(`SCX => ${data}`);
        } else if (address === 0xff42) {
            console.log(`SCY => ${data}`);
        } else {
            console.log(`${Helper.toHexText(address, 4)} => ${Helper.toHexText(data, 4)}`);
        }
    },
    breakpoints: [
        // { type: 'ADDR', value: 0xd600, pasue: true },
        { type: 'ADDR', value: 0xff01 }, // SB
        // { type: 'ADDR', value: 0xff46 }, // DMA
        // { type: 'ADDR', value: 0xff02 }, // SC
        // { type: 'ADDR', value: 0xff43 }, // SCX
        // { type: 'ADDR', value: 0xff42 }, // SCY
    ],
};