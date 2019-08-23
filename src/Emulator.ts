import Cartridge from "./cartridge/Cartridge";
import Clock, { Z80Clock } from "./cpu/Clock";
import CPU from "./cpu/CPU";
import { Display } from "./gpu/Display";
import GPU from "./gpu/GPU";
import MMU from "./memory/MMU";
import { cpuDebugger, memorydebuggerConfig } from "./utils/Debuggers";

export interface EmulatorConfig {
    display: Display
}

export default class Emulator {

    private readonly mmu: MMU;
    private readonly clock: Clock;
    private readonly cpu: CPU;

    constructor(configs: EmulatorConfig) {
        this.clock = Z80Clock();
        this.mmu = new MMU(this.clock, configs.display);
        this.cpu = new CPU({
            clock: this.clock,
            mmu: this.mmu,
            cpuDebuggerConfig: cpuDebugger,
            memoryDebuggerConfig: memorydebuggerConfig
        })
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
            this.clock.step(false);
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
        const addr = this.mmu.gpu.getTileAddress(tileIdx);
        return this.mmu.gpu.getTile(addr);
    }

    getByteAt(address: number) {
        return this.mmu.getByte(address);
    }

    getWordAt(address: number) {
        return this.mmu.getWord(address);
    }

};