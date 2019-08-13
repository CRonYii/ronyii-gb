import Clock, { Z80Clock } from "./cpu/Clock";
import CPU from "./cpu/CPU";
import { Display } from "./gpu/Display";
import GPU from "./gpu/GPU";
import MMU from "./memory/MMU";
import getROMmeta from "./memory/ROM";
import Helper from "./utils/Helper";

export interface EmulatorConfig {
    display: Display
}

export default class Emulator {

    private readonly mmu: MMU = new MMU();
    private readonly clock: Clock = Z80Clock();
    private readonly cpu: CPU;
    private readonly gpu: GPU;

    constructor(configs: EmulatorConfig) {
        this.cpu = new CPU({
            clock: this.clock,
            mmu: this.mmu,
            debuggerConfig: {
                breakpoints: [
                    { type: 'PC', value: 0x0100 }
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

    start(rom?: Uint8Array) {
        if (rom) {
            // TODO: load the rom
            const meta = getROMmeta(rom);
            console.log(meta);

            this.mmu.set(0x0000, 0x7fff, rom);
        }

        this.clock.start();
    }

    pause() {
        this.clock.pause();
    }

    step() {
        if (this.clock.isPaused()) {
            this.cpu.exec();
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

    getBGTile(lineIdx: number, tileIdx: number) {
        const addr = this.gpu.getBGTileAddress(lineIdx, tileIdx);
        const tile = [];
        for (let i = 0; i < 8; i++) {
            const tileline = this.gpu
                .getTileline(addr + i)
                .map((code: number) => this.gpu.getColor(code));
            tile.push(...tileline);
        }
        return tile;
    }

    getByteAt(address: number) {
        return this.mmu.getByte(address);
    }

    getWordAt(address: number) {
        return this.mmu.getWord(address);
    }

};