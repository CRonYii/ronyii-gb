export interface FlagControl {
    set: (flag: number) => void,
    get: () => number
}

export type FlagAttributes<T extends string> = {
    [key in T]: number
}

export default class FlagManager<T extends string> {

    private data: number = 0;
    private readonly flagAttributes: FlagAttributes<T>;
    private readonly flagControl: FlagControl;

    constructor(flagAttributes: FlagAttributes<T>, flagControl?: FlagControl) {
        this.flagControl = flagControl || {
            set: (flag: number) => {
                this.data = flag & 0xff;
            },
            get: () => this.data
        };
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

    setValue(value: number) {
        this.flagControl.set(value);
    }

    flag(): number {
        return this.flagControl.get();
    }

}