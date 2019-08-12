import { SCREEN_RESOLUTION } from "./constants/index";
import CPU from "./cpu/CPU";
import MMU from "./memory/MMU";
import loadROM from "./memory/ROM";
import { OPCODES, CB_OPCODES } from "./cpu/Opcodes";

function initDisplay() {
    const WINDOW_SCALE = 2;

    const GAMEBOY_WIDTH = SCREEN_RESOLUTION.WIDTH * WINDOW_SCALE;
    const GAMEBOY_HEIGHT = SCREEN_RESOLUTION.HEIGHT * WINDOW_SCALE;

    const canvas: HTMLCanvasElement | null = document.querySelector('#canvas');
    if (!canvas) {
        throw new Error('Canvas not found');
    }

    canvas.width = GAMEBOY_WIDTH;
    canvas.height = GAMEBOY_HEIGHT;

    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');

    if (ctx) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, GAMEBOY_WIDTH, GAMEBOY_HEIGHT);
    }
}

function loadROMFile(file: File): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const { result } = reader;
            if (result instanceof ArrayBuffer) {
                resolve(new Uint8Array(result));
            } else {
                reject('Failed to read file');
            }
        };
        reader.readAsArrayBuffer(file);
    });
}

function initROMLoader() {
    const romUpload: HTMLInputElement | null = document.querySelector('#rom-file');
    if (!romUpload) {
        throw new Error('rom upload button not found');
    }
    romUpload.onchange = async () => {
        if (romUpload.value === '') {
            return;
        }
        if (romUpload.files && romUpload.files.length >= 1) {
            const rom = await loadROMFile(romUpload.files[0]);
            loadROM(rom);
        }
    }

}

function debug() {
    const mmu = new MMU();
    mmu.setByte(0x014d, 0x00F0);
    const data: number[] = [0x86];
    for (let i = 0; i < data.length; i++) {
        mmu.setByte(0x0100 + i, data[i]);
    }
    const cpu = new CPU({
        mmu,
        instructionSetDefinition: OPCODES,
        cbInstructionSetDefinition: CB_OPCODES
    });
    cpu.run();
}

initDisplay();
initROMLoader();
debug();