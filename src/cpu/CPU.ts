import MMU from "../memory/MMU";
import Helper from "../utils/Helper";
import { CombinedRegister } from "./CombinedRegister";
import FlagRegister from "./FlagRegister";
import { Register16 } from "./Register16";

export default class CPU {

    private readonly mmu = new MMU();

    private readonly AF = new CombinedRegister(0x01b0);
    private readonly BC = new CombinedRegister(0x0013);
    private readonly DE = new CombinedRegister(0x00d8);
    private readonly HL = new CombinedRegister(0x014d);

    private readonly A = this.AF.high;
    private readonly F = new FlagRegister(this.AF.low);

    private readonly B = this.BC.high;
    private readonly C = this.BC.low;

    private readonly D = this.DE.high;
    private readonly E = this.DE.low;

    private readonly H = this.HL.high;
    private readonly L = this.HL.low;

    private readonly SP = new Register16(0xfffe);
    private readonly PC = new Register16(0x0100);

    constructor() {
        console.log(this.toString());
    }

    toString() {
        return `AF: ${Helper.toHexText(this.AF, 4)}, BC: ${Helper.toHexText(this.BC, 4)}, DE: ${Helper.toHexText(this.DE, 4)}, HL: ${Helper.toHexText(this.HL, 4)}, SP: ${Helper.toHexText(this.SP, 4)}, PC: ${Helper.toHexText(this.PC, 4)},  `;
    }

}