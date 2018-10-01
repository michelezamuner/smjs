const Parser = require('../../../src/Interpreter/Parser');
const Mnemonics = require('../../../src/Interpreter/Mnemonics');
const Byte = require('../../../src/DataTypes/Byte');
const Word = require('../../../src/DataTypes/Word');

/**
 * @type {Object}
 */
const registers = {};

/**
 * @type {Object}
 */
const memory = {};

/**
 * @type {null|Parser}
 */
let parser = null;

beforeEach(() => {
    registers.eax = new Byte(0x00);
    registers.ebx = new Byte(0x01);
    memory.write = jest.fn();
    parser = new Parser(registers, memory);
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
    parser.parse('');

    expect(memory.write).not.toBeCalled();
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
    parser.parse(code);

    expect(memory.write).toBeCalledTimes(12);
    expect(memory.write).nthCalledWith(1, new Word(0x00), Mnemonics.movi);
    expect(memory.write).nthCalledWith(2, new Word(0x01), registers.eax);
    expect(memory.write).nthCalledWith(3, new Word(0x02), new Byte(0x01));
    expect(memory.write).nthCalledWith(4, new Word(0x03), new Byte(0x00));
    expect(memory.write).nthCalledWith(5, new Word(0x04), Mnemonics.mov);
    expect(memory.write).nthCalledWith(6, new Word(0x05), registers.ebx);
    expect(memory.write).nthCalledWith(7, new Word(0x06), registers.eax);
    expect(memory.write).nthCalledWith(8, new Word(0x07), new Byte(0x00));
    expect(memory.write).nthCalledWith(9, new Word(0x08), Mnemonics.syscall);
    expect(memory.write).nthCalledWith(10, new Word(0x09), new Byte(0x00));
    expect(memory.write).nthCalledWith(11, new Word(0x0A), new Byte(0x00));
    expect(memory.write).nthCalledWith(12, new Word(0x0B), new Byte(0x00));
}
