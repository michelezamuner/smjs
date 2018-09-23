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

    verifyStandardCode(code);
});

test('accepts empty code', () => {
    const code = '';

    const instructions = parser.parse(code);

    expect(instructions).toEqual([]);
});

test('accepts empty lines', () => {
    const code = `
        mov eax, 1
        
        mov ebx, 2
        
        syscall
    `;

    verifyStandardCode(code);
});

test('accepts comment lines', () => {
    const code = `
        mov eax, 1
        ; comment line
        mov ebx, 2
        ; another comment line
        syscall
    `;

    verifyStandardCode(code);
});

test('accepts inline comments', () => {
    const code = `
        mov eax, 1  ; inline comment
        mov ebx, 2  ; another inline comment
        syscall
    `;

    verifyStandardCode(code);
});

function verifyStandardCode(code) {
    const instructions = parser.parse(code);

    expect(instructions.length).toBe(3);
    expect(instructions[0]).toEqual({opcode: 'mov', operands: ['eax', '1']});
    expect(instructions[1]).toEqual({opcode: 'mov', operands: ['ebx', '2']});
    expect(instructions[2]).toEqual({opcode: 'syscall', operands: []});
}
