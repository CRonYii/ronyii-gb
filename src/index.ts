import Emulator from "./Emulator";
import { initPage } from "./Page";

export const debugEnabled = true;

initPage();

export const emulator = new Emulator();
