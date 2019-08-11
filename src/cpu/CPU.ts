import Register8 from "./Register8";
import FlagRegister from "./FlagRegister";
import { byteBuffer } from "../utils/ByteBuffer";

export default class CPU {

    private readonly a: Register8 = new Register8();
    private readonly b: Register8 = new Register8();
    private readonly c: Register8 = new Register8();
    private readonly d: Register8 = new Register8();
    private readonly e: Register8 = new Register8();
    private readonly h: Register8 = new Register8();
    private readonly l: Register8 = new Register8();
    private readonly flags: FlagRegister = new FlagRegister();
    private readonly sp: Register8 = new Register8();
    private readonly pc: Register8 = new Register8();

    constructor() {
        
    }

}