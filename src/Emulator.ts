import Clock, { Z80Clock } from "./cpu/Clock";
import CPU from "./cpu/CPU";
import { Display } from "./gpu/Display";
import GPU from "./gpu/GPU";
import MMU from "./memory/MMU";
import Helper from "./utils/Helper";
import Cartridge from "./cartridge/Cartridge";
import { memorydebuggerConfig } from "./memory/MemoryDebugger";

export interface EmulatorConfig {
    display: Display
}

export default class Emulator {

    private readonly mmu: MMU;
    private readonly clock: Clock;
    private readonly cpu: CPU;
    private readonly gpu: GPU;

    constructor(configs: EmulatorConfig) {
        this.mmu = new MMU({
            debuggerConfig: memorydebuggerConfig
        });
        this.clock = Z80Clock();
        this.cpu = new CPU({
            clock: this.clock,
            mmu: this.mmu,
            debuggerConfig: {
                breakpoints: [
                    // { type: 'PC', value: 0x0100 }
                    // { type: 'OPCODE', value: 0xE0 }
                ],
                debugger: (cpu, type, value) => {
                    this.clock.pause();
                    console.warn(`Paused at breakpoint [${type}] => ${Helper.toHexText(value, 4)}`);
                }
            }
        })
        this.gpu = new GPU({
            clock: this.clock,
            display: configs.display,
            mmu: this.mmu
        });
    }

    start(rom?: Cartridge) {
        if (rom) {
            this.reset();
            this.mmu.load(rom);
        }

        this.clock.start();
    }

    reset() {
        // TODO
    }

    pause() {
        this.clock.pause();
    }

    step() {
        if (this.clock.isPaused()) {
            this.clock.step();
        }
    }

    isPaused() {
        return this.clock.isPaused();
    }

    getCPUInfo() {
        return {
            AF: this.cpu.read('AF'),
            BC: this.cpu.read('BC'),
            DE: this.cpu.read('DE'),
            HL: this.cpu.read('HL'),
            SP: this.cpu.read('SP'),
            PC: this.cpu.read('PC'),
            halt: this.cpu.isHalt(),
            IME: this.cpu.isInterrupsEnabled(),
        }
    }

    getTile(tileIdx: number) {
        const addr = this.gpu.getTileAddress(tileIdx);
        return this.gpu.getTile(addr);
    }

    getByteAt(address: number) {
        return this.mmu.getByte(address);
    }

    getWordAt(address: number) {
        return this.mmu.getWord(address);
    }

};