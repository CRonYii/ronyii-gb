import Helper from "../utils/Helper";

export interface MemoryDebuggerConfig {
    breakpoints: MemoryBreakpoint[],
    debugger: MemoryDebugger
}

export type BreakPointType = 'ADDR' | 'VAL';

export interface MemoryBreakpoint {
    type: BreakPointType,
    value: any,
    pasue?: boolean
};

export type MemoryDebugger = (address: number, value: number) => void;

export const memorydebuggerConfig: MemoryDebuggerConfig = {
    debugger: (address, data) => {
        if (address === 0xff43) {
            console.log(`SCX => ${data}`);
        } else if (address === 0xff42) {
            console.log(`SCY => ${data}`);
        } else {
            console.log(`${Helper.toHexText(address, 4)} => ${Helper.toHexText(data, 4)}`);
        }
    },
    breakpoints: [
        // { type: 'ADDR', value: 0xd600, pasue: true },
        // { type: 'ADDR', value: 0xff01 }, // SB
        // { type: 'ADDR', value: 0xff07 }, // TAC
        // { type: 'ADDR', value: 0xff46 }, // DMA
        // { type: 'ADDR', value: 0xff02 }, // SC
        // { type: 'ADDR', value: 0xff43 }, // SCX
        // { type: 'ADDR', value: 0xff42 }, // SCY
    ],
};

interface CPUBreakpoint {
    type: 'PC' | 'OPCODE',
    value: number,
    pause?: boolean
};

type CPUDebugger = (type: 'PC' | 'OPCODE', value: number) => void;

export interface CPUDebuggerConfig {
    breakpoints: CPUBreakpoint[],
    debugger: CPUDebugger
}

export const cpuDebugger: CPUDebuggerConfig = {
    breakpoints: [
        // { type: 'PC', value: 0xdef8 },
        // { type: 'PC', value: 0xdefa },
        // { type: 'PC', value: 0x0100 },
        // { type: 'OPCODE', value: 0xe8 }
    ],
    debugger: (type, value) => {
        switch (type) {
            case 'OPCODE':
                switch (value) {
                    default: console.warn(`Paused at breakpoint [${type}] => ${Helper.toHexText(value, 4)}`);
                }
                break;
            case 'PC':
                switch (value) {
                    default: console.warn(`Paused at breakpoint [${type}] => ${Helper.toHexText(value, 4)}`);
                }
                break;
        }
    }
}