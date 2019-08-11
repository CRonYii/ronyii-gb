import { MemoryController } from "./Memory";

const MemorySegmentDefinitions: MemoryController[] = [
    /** [0000-3FFF] Cartridge ROM, bank 0: 
     *  The first 16,384 bytes of the cartridge program
     *  are always available at this point in the memory map. */
    {
        start: 0x0000,
        end: 0x3fff,
        set: () => { }
    },
    /** [4000-7FFF] Cartridge ROM, other banks: 
     *  Any subsequent 16k "banks" of the cartridge program
     *  can be made available to the CPU here, one by one; a chip on the cartridge is generally
     *  used to switch between banks, and make a particular area accessible.
     *  The smallest programs are 32k, which means that no bank-selection chip is required. */
    {
        start: 0x4000,
        end: 0x7fff,
        set: () => { }
    },
    /** [8000-9FFF] Graphics RAM: 
     *  Data required for the backgrounds and sprites used by
     *  the graphics subsystem is held here, and can be changed by the cartridge program.
     *  This region will be examined in further detail in part 3 of this series. */
    {
        start: 0x8000,
        end: 0x9fff,
        set: () => { }
    },
    /** [A000-BFFF] Cartridge (External) RAM: 
     *  There is a small amount of writeable memory available in the GameBoy;
     *  if a game is produced that requires more RAM than is available in the hardware,
     *  additional 8k chunks of RAM can be made addressable here. */
    {
        start: 0xA000,
        end: 0xBfff,
        set: () => { }
    },
    /** [C000-DFFF] Working RAM:
     *  The GameBoy's internal 8k of RAM, which can be read from or written to by the CPU. */
    {
        start: 0xc000,
        end: 0xdfff,
        set: () => { }
    },
    /** [E000-FDFF] Working RAM (shadow): 
     *  Due to the wiring of the GameBoy hardware,
     *  an exact copy of the working RAM is available 8k higher in the memory map.
     *  This copy is available up until the last 512 bytes of the map,
     *  where other areas are brought into access. */
    {
        start: 0xe000,
        end: 0xfdff,
        set: () => { }
    },
    /** [FE00-FE9F] Graphics:
     *  sprite information: Data about the sprites rendered by the graphics chip are held here,
     *  including the sprites' positions and attributes. */
    {
        start: 0xfe00,
        end: 0xfe9f,
        set: () => { }
    },
    /** [FF00-FF7F] Memory-mapped I/O:
     *  Each of the GameBoy's subsystems (graphics, sound, etc.) has control values,
     *  to allow programs to create effects and use the hardware.
     *  These values are available to the CPU directly on the address bus, in this area. */
    {
        start: 0xff00,
        end: 0xff7f,
        set: () => { }
    },
    /** [FF80-FFFF] Zero-page RAM:
     *  A high-speed area of 128 bytes of RAM is available at the top of memory.
     *  Oddly, though this is "page" 255 of the memory, it is referred to as page zero,
     *  since most of the interaction between the program and the GameBoy hardware occurs through use of this page of memory. */
    {
        start: 0xff80,
        end: 0xffff,
        set: () => { }
    },
];

export default MemorySegmentDefinitions;