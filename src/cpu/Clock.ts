import { CPU_CLOCK_SPEED, TICKS_PER_SECOND } from "../constants/index";

export interface ClockConfig {
    ticksPerSecond: number,
    clockSpeed: number
}

export type ClockTaskResult = number | 'pause';

export type ClockTask = (clockCycles: number) => ClockTaskResult;

export default class Clock {

    private readonly clockSpeed: number;
    private readonly ticksPerSecond: number;

    private readonly tasks: ClockTask[] = [];
    private clockCycles: number = 0;
    private intervalID: number = 0;

    constructor(configs: ClockConfig) {
        const { ticksPerSecond, clockSpeed } = configs;
        this.clockSpeed = clockSpeed;
        this.ticksPerSecond = ticksPerSecond;
    }

    public start() {
        this.intervalID = window.setInterval(() => {
            this.tick();
        }, this.tickDuration);
    }

    public pause() {
        window.clearInterval(this.intervalID);
        this.intervalID = 0;
    }

    public add(task: ClockTask) {
        this.tasks.push(task);
    }

    private tick() {
        try {
            this.clockCycles = 0;
            while (!this.isPaused() && this.clockCycles < this.cyclesPerTick) {
                for (let task of this.tasks) {
                    const cyclesTaken = task(this.clockCycles);
                    if (cyclesTaken === 'pause') {
                        this.pause();
                        break;
                    }
                    this.clockCycles += cyclesTaken;
                }
            }
        } catch (err) {
            console.error(err);
            this.pause();
        }
    }

    public isPaused() {
        return this.intervalID === 0;
    }

    get cyclesPerTick() {
        return this.clockSpeed / this.ticksPerSecond;
    }

    get tickDuration() {
        return 1000 / this.ticksPerSecond;
    }

}

export const Z80Clock = () => new Clock({
    clockSpeed: CPU_CLOCK_SPEED,
    ticksPerSecond: TICKS_PER_SECOND
});