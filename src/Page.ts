import { SCREEN_RESOLUTION } from "./constants/index";
import { emulator } from "./index";
import Helper from "./utils/Helper";
import { OPCODES } from "./cpu/Opcodes";
import { Display, CanvasDisplay } from "./gpu/Display";

function initDisplay(): Display {
    const canvas: HTMLCanvasElement | null = document.querySelector('#canvas');

    if (!canvas) {
        throw new Error('Canvas not found');
    }

    return new CanvasDisplay({
        canvas,
        width: SCREEN_RESOLUTION.WIDTH,
        height: SCREEN_RESOLUTION.HEIGHT,
        scale: 2
    });
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
            emulator.start(rom);
        }
    }

}

const regs = ['AF', 'BC', 'DE', 'HL', 'SP', 'PC'];

function initCPUInfoDisplayer() {
    const cpuInfoDiv = document.querySelector('#cpu-info');
    if (!cpuInfoDiv) {
        throw new Error('cpu info div not found');
    }

    const border = '2px solid black';

    const table = document.createElement('table');
    table.style.border = border;
    table.style.borderCollapse = 'collapse';
    table.cellPadding = '2px';

    const tbody = table.createTBody();
    const row = tbody.insertRow();
    const cells = regs.map((reg) => {
        const cell = row.insertCell();
        cell.style.border = border;
        cell.innerText = `${reg}: ${Helper.toHexText(0, 4)}`;
        return cell;
    });

    const instructionLabel = document.createElement('div');
    instructionLabel.innerText = `Next Opcode: `;

    const update = () => {
        const info: any = emulator.getCPUInfo();
        regs.forEach((reg, index) => {
            cells[index].innerText = `${reg}: ${Helper.toHexText(info[reg], 4)}`;
        });
        const code = emulator.getByteAt(info.PC);
        const op = OPCODES[code];
        if (op) {
            instructionLabel.innerText = `Next Opcode: ${op.label}`;
        }
    }

    const stepButton = document.createElement('button');
    stepButton.innerText = 'step';
    stepButton.onclick = () => {
        emulator.step();
        update();
    };

    const updateButton = document.createElement('button');
    updateButton.innerText = 'update';
    updateButton.onclick = update;

    cpuInfoDiv.appendChild(table);
    cpuInfoDiv.appendChild(instructionLabel);
    cpuInfoDiv.appendChild(stepButton);
    cpuInfoDiv.appendChild(updateButton);
}

export const initPage = (): {
    display: Display
} => {
    const display = initDisplay();
    initROMLoader();
    initCPUInfoDisplayer();

    return { display };
};