import { d16, d8 } from "./DataTypes";
import ROMMaker from "./ROMMaker";
import Helper from "../utils/Helper";
import AssemblyFunction from "./AssemblyFunction";

const rom = new ROMMaker({
    title: 'JS-ASSEMBLER-01',
    romSize: 0,
    ramSize: 0,
    cartridgeType: 0,
});

const initRegs = rom.func(
    new AssemblyFunction()
        .ret()
);

rom.main(
    new AssemblyFunction()
        .di()
        .ld('SP', d16(0xdfff))
        .call(initRegs)
        .ld('A', d8(0x11))
);

const bin = rom.toBinary();

Helper.download('js-assembler-01.gb', bin);
