import { Memory } from "./Memory";
import { MEMORY_SIZE } from "../constants/index";

// Memory Management Unit
export default class MMU extends Memory {

    constructor() {
        super({ size: MEMORY_SIZE });
    }

};