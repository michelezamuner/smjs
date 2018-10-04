const Assembler = require('../../../../src/Assemblers/BASM/Assembler');
const Mnemonics = require('../../../../src/ProcessorArchitectures/SMA/Mnemonics');
const Byte = require('../../../../src/DataTypes/Byte');
const Word = require('../../../../src/DataTypes/Word');
const random = require('../../random');

/**
 * @type {Object}
 */
const registers = {};

/**
 * @type {null|Assembler}
 */
let assembler = null;

beforeEach(() => {
    registers.eax = new Byte(0x00);
    registers.ebx = new Byte(0x01);
    assembler = new Assembler(registers);
});

test('supports move with immediate addressing', () => {
    const code = `
        .data
        .text
            mov eax, 1
    `;

    const bytes = assembler.assemble(code);

    expect(bytes.length).toBe(4);
    expect(bytes).toEqual([Mnemonics.movi, registers.eax, new Byte(0x01), new Byte(0x00)]);
});

test('supports move with register addressing', () => {
    const code = `
        .data
        .text
            mov eax, ebx
    `;

    const bytes = assembler.assemble(code);

    expect(bytes.length).toBe(4);
    expect(bytes).toEqual([Mnemonics.mov, registers.eax, registers.ebx, new Byte(0x00)]);
});

test('supports move with memory addressing from memory into register', () => {
    const byte = random(Byte);
    const wordLeft = new Byte(random(Byte));
    const wordRight = new Byte(random(Byte));
    const word = new Word(wordLeft, wordRight);
    const code = `
        .data
            value1 db 0x${byte.toString(16)}
            value2 dw 0x${word.toInt().toString(16)}
        .text
            mov eax, value1
            mov ebx, value2
    `;

    const bytes = assembler.assemble(code);

    expect(bytes.length).toBe(11);
    expect(bytes).toEqual([
        Mnemonics.movmb, registers.eax, new Byte(0x00), new Byte(0x08),
        Mnemonics.movmw, registers.ebx, new Byte(0x00), new Byte(0x09),
        new Byte(byte), wordLeft, wordRight
    ]);
});

test('supports multiple spaces between tokens', () => {
    const code = `
        .data
            value   db  0x01
        .text
            mov     eax,    value
    `;

    const bytes = assembler.assemble(code);

    expect(bytes.length).toBe(5);
    expect(bytes).toEqual([
        Mnemonics.movmb, registers.eax, new Byte(0x00), new Byte(0x04),
        new Byte(0x01)
    ]);
});

test('accepts empty code', () => {
    const bytes = assembler.assemble('');

    expect(bytes).toEqual([]);
});

test('accepts empty lines', () => {
    const code = `
        .data
        
        .text
        
            mov eax, 1
        
            mov ebx, eax
        
            syscall
    `;

    const bytes = assembler.assemble(code);

    expect(bytes.length).toBe(12);
    expect(bytes).toEqual([
        Mnemonics.movi, registers.eax, new Byte(0x01), new Byte(0x00),
        Mnemonics.mov, registers.ebx, registers.eax, new Byte(0x00),
        Mnemonics.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
    ]);
});

test('accepts comment lines', () => {
    const code = `
        .data
        .text
            mov eax, 1
            ; comment line
            mov ebx, eax
            ; another comment line
            syscall
    `;

    const bytes = assembler.assemble(code);

    expect(bytes.length).toBe(12);
    expect(bytes).toEqual([
        Mnemonics.movi, registers.eax, new Byte(0x01), new Byte(0x00),
        Mnemonics.mov, registers.ebx, registers.eax, new Byte(0x00),
        Mnemonics.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
    ]);
});

test('accepts inline comments', () => {
    const code = `
        .data
        .text
            mov eax, 1    ; inline comment
            mov ebx, eax  ; another inline comment
            syscall
    `;

    const bytes = assembler.assemble(code);

    expect(bytes.length).toBe(12);
    expect(bytes).toEqual([
        Mnemonics.movi, registers.eax, new Byte(0x01), new Byte(0x00),
        Mnemonics.mov, registers.ebx, registers.eax, new Byte(0x00),
        Mnemonics.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
    ]);
});
