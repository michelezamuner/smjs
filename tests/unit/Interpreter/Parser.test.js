const Parser = require('../../../src/Interpreter/Parser');
const Mnemonics = require('../../../src/Interpreter/Mnemonics');
const Byte = require('../../../src/DataTypes/Byte');

/**
 * @type {null|Object}
 */
let registers = null;

/**
 * @type {null|Parser}
 */
let parser = null;

beforeEach(() => {
    registers = {
        eax: new Byte(0x00),
        ebx: new Byte(0x01)
    };
    parser = new Parser(registers);
});

test('parses code into instructions', () => {
    const code = `
        mov eax, 1
        mov ebx, eax
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
        
        mov ebx, eax
        
        syscall
    `;

    verifyStandardCode(code);
});

test('accepts comment lines', () => {
    const code = `
        mov eax, 1
        ; comment line
        mov ebx, eax
        ; another comment line
        syscall
    `;

    verifyStandardCode(code);
});

test('accepts inline comments', () => {
    const code = `
        mov eax, 1    ; inline comment
        mov ebx, eax  ; another inline comment
        syscall
    `;

    verifyStandardCode(code);
});

function verifyStandardCode(code) {
    const bytes = parser.parse(code);

    expect(bytes.length).toBe(12);
    expect(bytes).toEqual([
        Mnemonics.movi, registers.eax, new Byte(0x01), new Byte(0x00),
        Mnemonics.mov, registers.ebx, registers.eax, new Byte(0x00),
        Mnemonics.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
    ]);
}
