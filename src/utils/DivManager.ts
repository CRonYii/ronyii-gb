export interface Control<T> {
    set: (value: T) => void,
    get: () => T
}

export default class DivManager {

    private readonly div: HTMLDivElement;

    constructor(div: HTMLDivElement) {
        this.div = div;
    }

    label(initialValue = ''): Control<string> {
        const label = document.createElement('span');
        label.innerText = initialValue;

        this.div.appendChild(label);

        return {
            set: (text) => label.innerText = text,
            get: () => label.innerText
        };
    }

    input(config: {
        oninput?: (value: string) => void,
        onchange?: (value: string) => void,
        type?: string
    }): Control<string> {
        const { onchange, oninput, type } = config;
        const input = document.createElement('input');
        input.type = type || 'text';

        if (onchange) {
            input.onchange = () => onchange(input.value);
        }
        if (oninput) {
            input.oninput = () => oninput(input.value);
        }

        this.div.appendChild(input);

        return {
            set: (text) => input.value = text,
            get: () => input.value
        };
    }

    button(name: string, onclick: () => void) {
        const btn = document.createElement('button');
        btn.innerText = name;
        btn.onclick = onclick;

        this.div.appendChild(btn);
    }

    br() {
        this.div.appendChild(document.createElement('br'));
    }

}