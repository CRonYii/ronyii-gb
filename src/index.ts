import Emulator from "./Emulator";
import { initPage } from "./Page";

export const debugEnabled: any = require("./debug_options.json");

const { display } = initPage();

export const emulator = new Emulator({
    display
});

let wnd: any = window;
wnd.emulator = emulator;