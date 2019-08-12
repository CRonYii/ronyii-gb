export interface Display {
    setPixel: (x: number, y: number, color: number) => void,
    requestRefresh: () => void
}

export interface CanvasDisplayConfig {
    canvas: HTMLCanvasElement,
    width: number,
    height: number
    scale?: number,
}

export class CanvasDisplay implements Display {

    public readonly width: number;
    public readonly height: number;
    public readonly scale: number;
    private readonly ctx: CanvasRenderingContext2D;
    private readonly imageData: ImageData;
    private readonly displayData: Uint32Array;

    constructor(configs: CanvasDisplayConfig) {
        const { canvas, width, height, scale = 1 } = configs;
        this.scale = scale;
        this.width = width * scale;
        this.height = height * scale;

        canvas.width = this.width;
        canvas.height = this.height;

        const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('Failed to get Context');
        }

        this.ctx = ctx;
        this.imageData = ctx.createImageData(this.width, this.height);
        this.displayData = new Uint32Array(this.imageData.data.buffer);
    }

    setPixel(x: number, y: number, color: number) {
        const base = (x * this.scale) + ((y * this.scale) * this.width);
        for (let r = 1; r <= this.scale; r++) {
            for (let c = 1; c <= this.scale; c++) {
                this.displayData[base + c + (r * this.width)] = color;
            }
        }
    }

    requestRefresh() {
        this.ctx.putImageData(this.imageData, 0, 0);
    }

}