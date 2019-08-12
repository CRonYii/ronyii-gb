import { LOGIC_FRAME_PER_SECOND } from "./constants/index";
import CPU from "./cpu/CPU";
import { CB_OPCODES, OPCODES } from "./cpu/Opcodes";
import MMU from "./memory/MMU";
import getROMmeta from "./memory/ROM";

export default class Emulator {

    private readonly mmu: MMU = new MMU();
    private readonly cpu: CPU = new CPU({
        mmu: this.mmu,
        instructionSetDefinition: OPCODES,
        cbInstructionSetDefinition: CB_OPCODES
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
    }

    frame() {
        try {
            this.cpu.tick();
        } catch(err) {
            console.error(err);
            this.pause();
        }
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