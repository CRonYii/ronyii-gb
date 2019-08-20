import { MemoryReaderType, RegisterType, FlagMode } from "../utils/OpcodeTypes";
import { DataPiece, isDataPiece } from "./DataTypes";

export default class AssemblyFunction {

    private readonly code: number[] = [];
    private PC: number = 0x0000;

    private loadOpcode(opcode: number, data?: number, size?: 1 | 2): this {
        this.code[this.PC++] = opcode;
        if (data) {
            this.code[this.PC++] = data & 0xff;
            if (size == 2) {
                this.code[this.PC++] = (data >> 8) & 0xff;
            }
        }
        return this;
    }

    public ei() {
        return this.loadOpcode(0xfb);
    }

    public di() {
        return this.loadOpcode(0xf3);
    }

    public ld(target: RegisterType | MemoryReaderType | DataPiece, source: RegisterType | MemoryReaderType | DataPiece): this {
        if (isDataPiece(target)) {
            switch (target.type) {
                case 'a8':
                    if (source === 'A') this.loadOpcode(0xe0, target.data, target.size);
                case 'a16':
                    if (source === 'SP') this.loadOpcode(0x08, target.data, target.size);
                    if (source === 'A') this.loadOpcode(0xea, target.data, target.size);
            }
        }
        switch (target) {
            case 'B':
                if (isDataPiece(source) && source.size === 1) {
                    return this.loadOpcode(0x06, source.data, source.size);
                }
                switch (source) {
                    case 'B': return this.loadOpcode(0x40);
                    case 'C': return this.loadOpcode(0x41);
                    case 'D': return this.loadOpcode(0x42);
                    case 'E': return this.loadOpcode(0x43);
                    case 'H': return this.loadOpcode(0x44);
                    case 'L': return this.loadOpcode(0x45);
                    case '(HL)': return this.loadOpcode(0x46);
                    case 'A': return this.loadOpcode(0x47);
                }
                break;
            case 'C':
                if (isDataPiece(source) && source.size === 1) {
                    return this.loadOpcode(0x0e, source.data, source.size);
                }
                switch (source) {
                    case 'B': return this.loadOpcode(0x48);
                    case 'C': return this.loadOpcode(0x49);
                    case 'D': return this.loadOpcode(0x4a);
                    case 'E': return this.loadOpcode(0x4b);
                    case 'H': return this.loadOpcode(0x4c);
                    case 'L': return this.loadOpcode(0x4d);
                    case '(HL)': return this.loadOpcode(0x4e);
                    case 'A': return this.loadOpcode(0x4f);
                }
                break;
            case 'D':
                if (isDataPiece(source) && source.size === 1) {
                    return this.loadOpcode(0x16, source.data, source.size);
                }
                switch (source) {
                    case 'B': return this.loadOpcode(0x50);
                    case 'C': return this.loadOpcode(0x51);
                    case 'D': return this.loadOpcode(0x52);
                    case 'E': return this.loadOpcode(0x53);
                    case 'H': return this.loadOpcode(0x54);
                    case 'L': return this.loadOpcode(0x55);
                    case '(HL)': return this.loadOpcode(0x56);
                    case 'A': return this.loadOpcode(0x57);
                }
                break;
            case 'E':
                if (isDataPiece(source) && source.size === 1) {
                    return this.loadOpcode(0x1e, source.data, source.size);
                }
                switch (source) {
                    case 'B': return this.loadOpcode(0x58);
                    case 'C': return this.loadOpcode(0x59);
                    case 'D': return this.loadOpcode(0x5a);
                    case 'E': return this.loadOpcode(0x5b);
                    case 'H': return this.loadOpcode(0x5c);
                    case 'L': return this.loadOpcode(0x5d);
                    case '(HL)': return this.loadOpcode(0x5e);
                    case 'A': return this.loadOpcode(0x5f);
                }
                break;
            case 'H':
                if (isDataPiece(source) && source.size === 1) {
                    return this.loadOpcode(0x26, source.data, source.size);
                }
                switch (source) {
                    case 'B': return this.loadOpcode(0x60);
                    case 'C': return this.loadOpcode(0x61);
                    case 'D': return this.loadOpcode(0x62);
                    case 'E': return this.loadOpcode(0x63);
                    case 'H': return this.loadOpcode(0x64);
                    case 'L': return this.loadOpcode(0x65);
                    case '(HL)': return this.loadOpcode(0x66);
                    case 'A': return this.loadOpcode(0x67);
                }
                break;
            case 'L':
                if (isDataPiece(source) && source.size === 1) {
                    return this.loadOpcode(0x2e, source.data, source.size);
                }
                switch (source) {
                    case 'B': return this.loadOpcode(0x68);
                    case 'C': return this.loadOpcode(0x69);
                    case 'D': return this.loadOpcode(0x6a);
                    case 'E': return this.loadOpcode(0x6b);
                    case 'H': return this.loadOpcode(0x6c);
                    case 'L': return this.loadOpcode(0x6d);
                    case '(HL)': return this.loadOpcode(0x6e);
                    case 'A': return this.loadOpcode(0x6f);
                }
                break;
            case '(HL)':
                if (isDataPiece(source) && source.size === 1) {
                    return this.loadOpcode(0x36, source.data, source.size);
                }
                switch (source) {
                    case 'B': return this.loadOpcode(0x70);
                    case 'C': return this.loadOpcode(0x71);
                    case 'D': return this.loadOpcode(0x72);
                    case 'E': return this.loadOpcode(0x73);
                    case 'H': return this.loadOpcode(0x74);
                    case 'L': return this.loadOpcode(0x75);
                    case 'A': return this.loadOpcode(0x77);
                }
                break;
            case 'A':
                if (isDataPiece(source) && source.size === 1) {
                    switch (source.type) {
                        case 'd8': return this.loadOpcode(0x3e, source.data, source.size);
                        case 'a8': return this.loadOpcode(0xf0, source.data, source.size);
                        case 'a16': return this.loadOpcode(0xfa, source.data, source.size);
                    }
                }
                switch (source) {
                    case '(BC)': return this.loadOpcode(0x0a);
                    case '(DE)': return this.loadOpcode(0x1a);
                    case '(HL+)': return this.loadOpcode(0x2a);
                    case '(HL-)': return this.loadOpcode(0x3a);
                    case 'B': return this.loadOpcode(0x78);
                    case 'C': return this.loadOpcode(0x79);
                    case 'D': return this.loadOpcode(0x7a);
                    case 'E': return this.loadOpcode(0x7b);
                    case 'H': return this.loadOpcode(0x7c);
                    case 'L': return this.loadOpcode(0x7d);
                    case '(HL)': return this.loadOpcode(0x7e);
                    case 'A': return this.loadOpcode(0x7f);
                    case '(C)': return this.loadOpcode(0x72);
                }
                break;
            case 'BC':
                if (isDataPiece(source) && source.size === 2) {
                    return this.loadOpcode(0x01, source.data, source.size);
                }
                break;
            case 'DE':
                if (isDataPiece(source) && source.size === 2) {
                    return this.loadOpcode(0x11, source.data, source.size);
                }
                break;
            case 'HL':
                if (isDataPiece(source) && source.size === 2) {
                    return this.loadOpcode(0x21, source.data, source.size);
                }
                break;
            case 'SP':
                if (isDataPiece(source) && source.size === 2) {
                    return this.loadOpcode(0x31, source.data, source.size);
                }
                if (source === 'HL') return this.loadOpcode(0xf9);
                break;
            case '(BC)':
                if (source === 'A') return this.loadOpcode(0x02);
                break;
            case '(DE)':
                if (source === 'A') return this.loadOpcode(0x12);
                break;
            case '(HL+)':
                if (source === 'A') return this.loadOpcode(0x22);
                break;
            case '(HL-)':
                if (source === 'A') return this.loadOpcode(0x32);
                break;
            case '(C)':
                if (source === 'A') return this.loadOpcode(0xf2);
                break;
        }
        throw new Error('Unsupported [LD] instruction [' + target + ', ' + source + ']');
    }

    public ldhl(source: DataPiece): this {
        if (source.type === 'r8') {
            return this.loadOpcode(0xf8, source.data, source.size);
        }
        throw new Error('Unsupported [LDHL] instruction [' + source.type + ']');
    }

    public call(address: DataPiece, flag?: FlagMode): this {
        if (address.type === 'a16') {
            switch (flag) {
                case 'NZ': return this.loadOpcode(0xc4, address.data, address.size);
                case 'Z': return this.loadOpcode(0xcc, address.data, address.size);
                case 'NC': return this.loadOpcode(0xd4, address.data, address.size);
                case 'C': return this.loadOpcode(0xdc, address.data, address.size);
                default: return this.loadOpcode(0xcd, address.data, address.size);
            }
        }
        throw new Error('Unsupported [CALL] instruction [' + address.type + ']');
    }

    public ret(flag?: FlagMode): this {
        switch (flag) {
            case 'NZ': return this.loadOpcode(0xc0);
            case 'Z': return this.loadOpcode(0xc8);
            case 'NC': return this.loadOpcode(0xd0);
            case 'C': return this.loadOpcode(0xd8);
            default: return this.loadOpcode(0xc9);
        }
    }

    public reti() {
        return this.loadOpcode(0xd9);
    }

    toBinary() {
        return this.code.slice(0);
    }

    size() {
        return this.code.length;
    }

}