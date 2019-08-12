import MMU from "../memory/MMU";
import { Display } from "./Display";
import Clock from "../cpu/Clock";

export interface GPUConfigs {
    clock: Clock,
    mmu: MMU,
    display: Display
}

export default class GPU {

    private readonly mmu: MMU;
    private readonly display: Display;

    constructor(configs: GPUConfigs) {
        this.mmu = configs.mmu;
        this.display = configs.display;
        configs.clock.add(() => {
            // TODO
            return 0;
        });
    }

}