import Helper from "./Helper";

export default class Timer {

    private _period: number = 0;
    private counter: number = 0;

    constructor(period: number) {
        this.period = period;
    }

    tick(cyclesTaken: number) {
        this.counter += cyclesTaken;
        const n = Math.floor(this.counter / this._period);
        this.counter %= this._period;
        return n;
    }

    set period(period: number) {
        this._period = Helper.toUnsigned32(period);
    }

    get period() {
        return this._period;
    }

}