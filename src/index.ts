import Emulator from "./Emulator";
import { initPage } from "./Page";

export const debugEnabled = {
    printMemory: false,
    breakpoints: true,
    interrupts: true
};

const { display } = initPage();

export const emulator = new Emulator({
    display
});