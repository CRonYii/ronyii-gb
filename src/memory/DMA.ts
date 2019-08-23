import { Memory } from "./Memory";
import Helper from "../utils/Helper";
import MMU from "./MMU";

export default class DMA implements Memory {

    private readonly mmu: MMU;

    constructor(mmu: MMU) {
        this.mmu = mmu;
    }

    setByte(address: number, data: number): void {
        if (data > 0xf1) {
            throw new Error('Invalid DMA transfer request: ' + Helper.toHexText(data, 2));
        }
        const offset = data << 8;
        for (let i = 0; i <= 0x9f; i++) {
            this.mmu.setByte(0xfe00 + i, this.mmu.getByte(offset + i));
        }
    }

    getByte(address: number): number {
        return 0x00;
    }

    size(): number {
        return 1;
    }

}