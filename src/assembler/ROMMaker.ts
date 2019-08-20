import ALU from "../cpu/ALU";
import Helper from "../utils/Helper";
import { MemoryReaderType, RegisterType } from "../utils/OpcodeTypes";
import { DataPiece, isDataPiece, a16 } from "./DataTypes";
import AssemblyFunction from "./AssemblyFunction";

const NINTENDO_LOGO = [
    0xCE, 0xED, 0x66, 0x66, 0xCC, 0x0D, 0x00, 0x0B, 0x03, 0x73, 0x00, 0x83, 0x00, 0x0C, 0x00, 0x0D,
    0x00, 0x08, 0x11, 0x1F, 0x88, 0x89, 0x00, 0x0E, 0xDC, 0xCC, 0x6E, 0xE6, 0xDD, 0xDD, 0xD9, 0x99,
    0xBB, 0xBB, 0x67, 0x63, 0x6E, 0x0E, 0xEC, 0xCC, 0xDD, 0xDC, 0x99, 0x9F, 0xBB, 0xB9, 0x33, 0x3E,
];

export interface ROMMakerConfig {
    title: string,
    cartridgeType: number,
    romSize: number,
    ramSize: number
}

export default class ROMMaker {

    private readonly title: string;
    private readonly cartridgeType: number;
    private readonly romSize: number;
    private readonly ramSize: number;

    private stackPtr: number;

    private rom: Uint8Array;

    constructor(configs: ROMMakerConfig) {
        this.title = configs.title;
        this.cartridgeType = configs.cartridgeType;
        this.romSize = configs.romSize;
        this.ramSize = configs.ramSize;
        this.stackPtr = (32 * 1024) << this.romSize;
        this.rom = this.initROM();
    }

    private initROM() {
        const rom = new Uint8Array((32 * 1024) << this.romSize);

        rom.set([0x00, 0xC3, 0x50, 0x01], 0x0100); // set the main entry point
        rom.set(NINTENDO_LOGO, 0x104);
        rom.set(Helper.fromText(this.title.substring(0, 16)), 0x134);
        rom[0x0147] = this.cartridgeType;
        rom[0x0148] = this.romSize;
        rom[0x0149] = this.ramSize;

        let checkSum = 0;
        for (let i = 0x0134; i < 0x014C; i++) {
            checkSum = ALU.sub8(checkSum, rom[i]).result;
            checkSum = ALU.sub8(checkSum, 1).result;
        }

        rom[0x014d] = checkSum;

        return rom;
    }

    public func(func: AssemblyFunction): DataPiece {
        // TODO: Bound check > 0x3fff
        this.stackPtr -= func.size();
        this.rom.set(func.toBinary(), this.stackPtr);
        return a16((this.stackPtr % 0x4000) + 0x4000);
    }

    public main(func: AssemblyFunction) {
        this.rom.set(func.toBinary(), 0x0150);
    }

    public toBinary(): Uint8Array {
        return this.rom.slice(0);
    }

}