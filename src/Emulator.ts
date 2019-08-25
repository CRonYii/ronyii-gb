import APU from "./apu/APU";
import Cartridge from "./cartridge/Cartridge";
import Clock, { Z80Clock } from "./cpu/Clock";
import CPU from "./cpu/CPU";
import { Display } from "./gpu/Display";
import GPU from "./gpu/GPU";
import { InterruptFlagsEKey, InterruptsFlags } from "./memory/IORegisters";
import { JoyPad } from "./memory/JoyPad";
import MMU from "./memory/MMU";
import { GBTimer } from "./memory/GBTimer";
import { cpuDebugger, memorydebuggerConfig } from "./utils/Debuggers";
import FlagManager from "./utils/FlagManager";

export interface EmulatorConfig {
    display: Display
}

export default class Emulator {

    private display: Display;

    private interruptEnableManager: FlagManager<InterruptFlagsEKey>;
    private interruptFlagsManager: FlagManager<InterruptFlagsEKey>;

    private cpu: CPU;
    private mmu: MMU;
    private gpu: GPU;
    private apu: APU;
    private clock: Clock;
    private joypad: JoyPad;
    private timer: GBTimer;

    constructor(configs: EmulatorConfig) {
        const { display } = configs;
        this.display = display;
        this.clock = Z80Clock();
        this.interruptEnableManager = new FlagManager<InterruptFlagsEKey>(InterruptsFlags);
        this.interruptFlagsManager = new FlagManager<InterruptFlagsEKey>(InterruptsFlags);
        this.gpu = new GPU({ display: this.display, interruptFlagsManager: this.interruptFlagsManager });
        this.apu = new APU();
        this.joypad = new JoyPad(this.interruptEnableManager);
        this.timer = new GBTimer(this.interruptFlagsManager);
        this.mmu = new MMU({
            gpu: this.gpu,
            apu: this.apu,
            joypad: this.joypad,
            timer: this.timer,
            interruptEnableManager: this.interruptEnableManager,
            interruptFlagsManager: this.interruptFlagsManager
        });
        this.cpu = new CPU({
            mmu: this.mmu,
            cpuDebuggerConfig: cpuDebugger,
            memoryDebuggerConfig: memorydebuggerConfig
        });
        this.clock.add([this.cpu, this.gpu, this.apu, this.timer]);
    }

    start(rom?: Cartridge) {
        if (rom) {
            this.reset();
            this.mmu.load(rom);
        }

        this.clock.start();
    }

    reset() {
        this.clock.pause();
        this.clock = Z80Clock();
        this.interruptEnableManager = new FlagManager<InterruptFlagsEKey>(InterruptsFlags);
        this.interruptFlagsManager = new FlagManager<InterruptFlagsEKey>(InterruptsFlags);
        this.gpu = new GPU({ display: this.display, interruptFlagsManager: this.interruptFlagsManager });
        this.apu = new APU();
        this.joypad = new JoyPad(this.interruptEnableManager);
        this.timer = new GBTimer(this.interruptFlagsManager);
        this.mmu = new MMU({
            gpu: this.gpu,
            apu: this.apu,
            joypad: this.joypad,
            timer: this.timer,
            interruptEnableManager: this.interruptEnableManager,
            interruptFlagsManager: this.interruptFlagsManager
        });
        this.cpu = new CPU({
            mmu: this.mmu,
            cpuDebuggerConfig: cpuDebugger,
            memoryDebuggerConfig: memorydebuggerConfig
        });
        this.clock.add([this.cpu, this.gpu, this.apu, this.timer]);
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