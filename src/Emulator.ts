import MMU from "./memory/MMU";
import CPU from "./cpu/CPU";
import { OPCODES, CB_OPCODES } from "./cpu/Opcodes";

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
        }, 1000); // TODO: implement timing
    }

    tick() {
        this.cpu.exec();
        console.log(this.cpu.toString());
    }

};