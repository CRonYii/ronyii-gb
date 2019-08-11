import { Memory } from "./memory/Memory";
import { MEMORY_SIZE } from "./constants/index";
import MemorySegmentDefinitions from "./memory/MemorySegmentDefinitions";

const canvas: HTMLCanvasElement | null = document.querySelector('#canvas');
if (!canvas) {
    throw new Error('Canvas not found');
}

const WINDOW_SCALE = 2;

const GAMEBOY_WIDTH = 160 * WINDOW_SCALE;
const GAMEBOY_HEIGHT = 144 * WINDOW_SCALE;

canvas.width = GAMEBOY_WIDTH;
canvas.height = GAMEBOY_HEIGHT;

const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');

if (ctx) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, GAMEBOY_WIDTH, GAMEBOY_HEIGHT);
}

const mem = new Memory({
    size: MEMORY_SIZE,
    controllers: MemorySegmentDefinitions
});