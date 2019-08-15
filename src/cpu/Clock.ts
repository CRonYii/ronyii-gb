import { CPU_CLOCK_SPEED, TICKS_PER_SECOND } from "../constants/index";
import { debugEnabled } from "../index";

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

    private cycles: number = 0;

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
                this.step();
            }
        } catch (err) {
            console.error(err);
            this.pause();
        }
    }

    public step() {
        let totalCyclesTaken = 0;
        for (let task of this.tasks) {
            const cyclesTaken = task(totalCyclesTaken);
            if (cyclesTaken === 'pause') {
                this.pause();
                break;
            }
            totalCyclesTaken += cyclesTaken;
        }
        this.clockCycles += totalCyclesTaken;
        if (debugEnabled.pauseEveryTick) {
            if (++this.cycles === debugEnabled.pauseEveryTick) {
                this.pause();
                this.cycles = 0;
                console.warn('Paused');
            }
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