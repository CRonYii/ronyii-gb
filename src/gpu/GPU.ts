import MMU from "../memory/MMU";
import { Display } from "./Display";

export interface GPUConfigs {
    mmu: MMU,
    display: Display
}

export default class GPU {

    private readonly mmu: MMU;
    private readonly display: Display;

    constructor(configs: GPUConfigs) {
        this.mmu = configs.mmu;
        this.display = configs.display;
    }

}