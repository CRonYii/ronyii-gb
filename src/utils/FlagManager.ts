export interface FlagControl {
    set: (flag: number) => void,
    get: () => number
}

export type FlagAttributes<T extends string> = {
    [key in T]: number
}

export default class FlagManager<T extends string> {

    private readonly flagControl: FlagControl;
    private readonly flagAttributes: FlagAttributes<T>;

    constructor(flagControl: FlagControl, flagAttributes: FlagAttributes<T>) {
        this.flagControl = flagControl;
        this.flagAttributes = flagAttributes;
    }

    set(flag: T, value: boolean) {
        const flagIndex = 1 << this.flagAttributes[flag];

        let byte = this.flagControl.get();

        this.flagControl.set(
            value
                ? flagIndex | byte
                : ~flagIndex & byte
        );
    }

    get(flag: T): boolean {
        const flagIndex = 1 << this.flagAttributes[flag];

        return (this.flagControl.get() & flagIndex) !== 0;
    }

    flag(): number {
        return this.flagControl.get();
    }

}