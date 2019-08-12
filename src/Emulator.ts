import MMU from "./memory/MMU";
import CPU from "./cpu/CPU";
import { OPCODES, CB_OPCODES } from "./cpu/Opcodes";
import { debugEnabled } from "./index";

export default class Emulator {

    private readonly mmu: MMU = new MMU();
    private readonly cpu: CPU = new CPU({
        mmu: this.mmu,
        instructionSetDefinition: OPCODES,
        cbInstructionSetDefinition: CB_OPCODES
    });

    start(rom: Uint8Array) {
        // TODO: load the rom
        setInterval(() => {
            this.tick();
        }, 10); // TODO: implement timing
    }

    tick() {
        this.cpu.exec();
        if (debugEnabled)
            console.log(this.cpu.toString());
    }

};