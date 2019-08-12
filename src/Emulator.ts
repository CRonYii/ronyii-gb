import { LOGIC_FRAME_PER_SECOND } from "./constants/index";
import CPU from "./cpu/CPU";
import MMU from "./memory/MMU";
import getROMmeta from "./memory/ROM";
import Helper from "./utils/Helper";

export default class Emulator {

    private readonly mmu: MMU = new MMU();
    private readonly cpu: CPU = new CPU({
        mmu: this.mmu,
        debuggerConfig: {
            breakpoints: [
                { type: 'PC', value: 0x0100 }
            ],
            debugger: (cpu, type, value) => {
                this.pause();
                console.warn(`Paused at breakpoint [${type}] => ${Helper.toHexText(value, 4)}`);
            }
        }
    });

    private intervalID: number = 0;

    start(rom: Uint8Array) {
        // TODO: load the rom
        const meta = getROMmeta(rom);
        console.log(meta);

        this.intervalID = window.setInterval(() => {
            this.frame();
        }, 1000 / LOGIC_FRAME_PER_SECOND);
    }

    pause() {
        window.clearInterval(this.intervalID);
        this.intervalID = 0;
    }

    frame() {
        try {
            this.cpu.tick();
        } catch (err) {
            console.error(err);
            this.pause();
        }
    }

    step() {
        if (this.isPaused()) {
            this.cpu.exec();
        }
    }

    isPaused(): boolean {
        return this.intervalID === 0;
    }

    getCPUInfo() {
        return {
            AF: this.cpu.read('AF'),
            BC: this.cpu.read('BC'),
            DE: this.cpu.read('DE'),
            HL: this.cpu.read('HL'),
            SP: this.cpu.read('SP'),
            PC: this.cpu.read('PC'),
        }
    }

    getByteAt(address: number) {
        return this.mmu.getByte(address);
    }

    getWordAt(address: number) {
        return this.mmu.getWord(address);
    }

};