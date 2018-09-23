const Parser = require('../../../src/Parser/Parser');

/**
 * @type {null|Parser}
 */
let parser = null;

beforeEach(() => {
    parser = new Parser();
});

test('parses code into instructions', () => {
    const code = `
        mov eax, 1
        mov ebx, 2
        syscall
    `;

    const instructions = parser.parse(code);

    expect(instructions.length).toBe(3);
    expect(instructions[0]).toEqual({opcode: 'mov', operands: ['eax', '1']});
    expect(instructions[1]).toEqual({opcode: 'mov', operands: ['ebx', '2']});
    expect(instructions[2]).toEqual({opcode: 'syscall', operands: []});
});

test('parses empty code', () => {
    const code = '';

    const instructions = parser.parse(code);

    expect(instructions).toEqual([]);
});
