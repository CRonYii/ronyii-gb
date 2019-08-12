import MMU from "./memory/MMU";
import CPU from "./cpu/CPU";
import { OPCODES, CB_OPCODES } from "./cpu/Opcodes";
import { debugEnabled } from "./index";
import getROMmeta from "./memory/ROM";
import { LOGIC_FRAME_PER_SECOND } from "./constants/index";

export default class Emulator {

    private readonly mmu: MMU = new MMU();
    private readonly cpu: CPU = new CPU({
        mmu: this.mmu,
        instructionSetDefinition: OPCODES,
        cbInstructionSetDefinition: CB_OPCODES
    });

    start(rom: Uint8Array) {
        // TODO: load the rom
        const meta = getROMmeta(rom);
        console.log(meta);

        setInterval(() => {
            this.frame();
        }, 1000 / LOGIC_FRAME_PER_SECOND);
    }

    frame() {
        this.cpu.tick();
        if (debugEnabled)
            console.log(this.cpu.toString());
    }

};