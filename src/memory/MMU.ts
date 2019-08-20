import Cartridge from "../cartridge/Cartridge";
import FlagManager from "../utils/FlagManager";
import BIOS from "./BIOS";
import { InterruptFlagsEKey, InterruptsFlags } from "./IORegisters";
import { Memory, MemorySegment } from "./Memory";
import { MemoryDebuggerConfig } from "./MemoryDebugger";
import { Timer } from "./Timer";
import Clock from "../cpu/Clock";

export interface MMUConfig {

}

// Memory Management Unit
export default class MMU implements Memory {

    private CARTRIDGE: Memory = new MemorySegment({ size: 0x0000 }); // The Cartridge, not loaded by default

    private readonly BIOS: Memory = BIOS;
    private readonly VRAM: Memory = new MemorySegment({ size: 0x2000, offset: 0x8000, readable: true, writable: true }); // 8kB Video RAM
    private readonly WRAM: Memory = new MemorySegment({ size: 0x2000, offset: 0xC000, readable: true, writable: true }); // 8kB Working RAM
    private readonly ECHO_RAM: Memory = new MemorySegment({ size: 0x1E00, offset: 0xE000, readable: true, writable: true }); // ECHO RAM Mirror of 0xC000 ~ 0xDDFF TODO: implement a ECHO_RAM class
    private readonly OAM: Memory = new MemorySegment({ size: 0x00A0, offset: 0xFE00, readable: true, writable: true }); // 160 bytes Sprite attribute table (OAM)
    private readonly UNUSABLE: Memory = new MemorySegment({ size: 0x0060, readable: false, writable: false }); // 96 bytes of UNSABLE Memory (0xFEA0 ~ 0xFEFF)
    private readonly TIMER: Memory; // Timer
    private readonly IO_REGS: Memory = new MemorySegment({ size: 0x0080, offset: 0xFF00, readable: true, writable: true }); // I/O Registers
    private readonly HRAM: Memory = new MemorySegment({ size: 0x0080, offset: 0xFF80, readable: true, writable: true }); // High RAM - Zero Page Memory

    private inBIOS: boolean = true;
    private debuggerConfig?: MemoryDebuggerConfig;

    public readonly interruptEnableManager = new FlagManager<InterruptFlagsEKey>({
        get: () => this.getByte(0xffff),
        set: (byte) => this.setByte(0xffff, byte)
    }, InterruptsFlags);

    public readonly interruptFlagsManager = new FlagManager<InterruptFlagsEKey>({
        get: () => this.getByte(0xff0f),
        set: (byte) => this.setByte(0xff0f, byte)
    }, InterruptsFlags);

    constructor(clock: Clock) {
        this.TIMER = new Timer(clock, this.interruptFlagsManager);
        this.reset();
    }

    load(cartridge: Cartridge) {
        this.CARTRIDGE = cartridge;
        this.reset();

        console.log('Loaded Cartridge => ', cartridge);
    }

    reset() {
        this.setBytes([
            // TIMA              TMA           TAC             NR10
            [0xFF05, 0x00], [0xFF06, 0x00], [0xFF07, 0x00], [0xFF10, 0x80],
            // NR11              NR12          NR14            NR21
            [0xFF11, 0xBF], [0xFF12, 0xF3], [0xFF14, 0xBF], [0xFF16, 0x3F],
            // NR22              NR24          NR30            NR31
            [0xFF17, 0x00], [0xFF19, 0xBF], [0xFF1A, 0x7F], [0xFF1B, 0xFF],
            // NR32              NR33          NR41            NR42
            [0xFF1C, 0x9F], [0xFF1E, 0xBF], [0xFF20, 0xFF], [0xFF21, 0x00],
            // NR43              NR30          NR50            NR51
            [0xFF22, 0x00], [0xFF23, 0xBF], [0xFF24, 0x77], [0xFF25, 0xF3],
            // NR52              LCDC          SCY             SCX
            [0xFF26, 0xF1], [0xFF40, 0x91], [0xFF42, 0x00], [0xFF43, 0x00],
            // LYC               BGP           OBP0            OBP1
            [0xFF45, 0x00], [0xFF47, 0xFC], [0xFF48, 0xFF], [0xFF49, 0xFF],
            // WY                WX            IE
            [0xFF4A, 0x00], [0xFF4B, 0x00], [0xFFFF, 0x00]
        ]);
    }

    setByte(address: number, data: number) {
        this.getSegment(address).setByte(address, data);
    }

    getByte(address: number): number {
        return this.getSegment(address).getByte(address);
    }

    getSegment(address: number): Memory {
        address &= 0xFFFF;
        if (address <= 0x7FFF) {
            // TODO: handle BIOS 
            return this.CARTRIDGE;
        }
        switch (address & 0xF000) {
            case 0x8000: case 0x9000:
                return this.VRAM;
            case 0xA000: case 0xB000:
                return this.CARTRIDGE;
            case 0xC000: case 0xD000:
                return this.WRAM;
            case 0xE000:
                return this.ECHO_RAM;
            case 0xF000:
                if ((address & 0x0FFF) <= 0xDFF) {
                    return this.ECHO_RAM;
                }
                switch (address & 0x0F00) {
                    case 0xE00:
                        if ((address & 0x00FF) <= 0x9F) {
                            return this.OAM;
                        } else {
                            return this.UNUSABLE;
                        }
                    case 0xF00:
                        if ((address & 0x00FF) <= 0x7F) {
                            if ((address & 0x00FF) >= 0x04 && (address & 0x00FF) <= 0x07) {
                                return this.TIMER;
                            }
                            return this.IO_REGS;
                        } else {
                            return this.HRAM;
                        }
                }
        }
        throw new Error('Memory Address out of bound ' + address);
    }

    setBytes(kvPairs: number[][]) {
        for (let [addr, data] of kvPairs) {
            this.setByte(addr, data);
        }
    }

    getBytes(addresses: number[]): number[] {
        const values = new Array<number>(addresses.length);
        for (let i = 0; i < addresses.length; i++) {
            values[i] = this.getByte(addresses[i]);
        }
        return values;
    }

    setWord(address: number, data: number) {
        this.setByte(address, data & 0xff);
        this.setByte(address + 1, data >> 8);
    }

    getWord(address: number): number {
        return this.getByte(address) + (this.getByte(address + 1) << 8);
    }

    shouldInterrupt(key: InterruptFlagsEKey) {
        return this.interruptEnableManager.get(key)
            && this.interruptFlagsManager.get(key);
    }

    size() {
        return 0x10000; // 2^12 === 65536
    }

};