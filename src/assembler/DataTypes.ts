import Helper from "../utils/Helper";

const $$typeof = Symbol.for('data-piece');

export interface DataPiece {
    $$typeof: Symbol,
    type: 'd8' | 'd16' | 'r8' | 'a8' | 'a16'
    size: 1 | 2,
    data: number
}

export const d8 = (data: number): DataPiece => ({
    $$typeof,
    type: 'd8',
    size: 1,
    data: data & 0xff
});

export const d16 = (data: number): DataPiece => ({
    $$typeof,
    type: 'd16',
    size: 2,
    data: data & 0xffff
});

export const r8 = (data: number): DataPiece => ({
    $$typeof,
    type: 'r8',
    size: 1,
    data: Helper.toUnsigned8(data)
});

export const a8 = (data: number): DataPiece => ({
    $$typeof,
    type: 'a8',
    size: 1,
    data: data & 0xff
});

export const a16 = (data: number): DataPiece => ({
    $$typeof,
    type: 'a16',
    size: 2,
    data: data & 0xffff
});

export function isDataPiece(arg: any): arg is DataPiece {
    return arg.$$typeof === $$typeof;
}