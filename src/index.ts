import Emulator from "./Emulator";
import { initPage } from "./Page";

export const debugEnabled = {
    printMemory: false,
    breakpoints: true
};

initPage();

export const emulator = new Emulator();