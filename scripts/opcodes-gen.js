// http://pastraiser.com/cpu/gameboy/gameboy_opcodes.html

function toInstructionSet(table) {
    var rows = [...table.querySelectorAll('tr')].slice(1).map((r) => [...r.querySelectorAll('td')].slice(1)).flat();

    return rows.map((item) => {
        var raw = item.innerText.trim();
        if (raw === '') {
            return null;
        }
        var [label, sizes, flags] = raw.split('\n');
        var [operation, operands] = label.split(' ');
        if (operands)
            operands = operands.split(',');
        var [opcode_length, clock_cycles] = sizes.split(String.fromCharCode(160)).filter((i) => i.trim() !== '');
        opcode_length = Number(opcode_length);
        clock_cycles = clock_cycles.split('/').map(n => Number(n));
        var [z, n, h, c] = flags.split(' ');
        var convertFlag = { '1': 1, '0': 0, 'Z': true, 'N': true, 'H': true, 'C': true, '-': false };
        return { label, operation, operands, opcode_length, clock_cycles, setZero: convertFlag[z], setSubtract: convertFlag[n], setHalfCarry: convertFlag[h], setCarry: convertFlag[c] }
    })
}

var [opcodes_table, cb_opcodes_table] = document.querySelectorAll('table');

var opcodes = toInstructionSet(opcodes_table);
var cb_opcodes = toInstructionSet(cb_opcodes_table);