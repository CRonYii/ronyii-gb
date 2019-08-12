import Emulator from "./Emulator";
import { initPage } from "./Page";

export const debugEnabled = false;

initPage();

export const emulator = new Emulator();
