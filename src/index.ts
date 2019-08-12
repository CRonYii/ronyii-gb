import Emulator from "./Emulator";
import { initPage } from "./Page";
import { SCREEN_RESOLUTION } from "./constants/index";

export const debugEnabled = {
    printMemory: false,
    breakpoints: true
};

const { display } = initPage();

export const emulator = new Emulator({
    display
});