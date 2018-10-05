const Assembler = require('../../../../src/Assemblers/BASM/Assembler');
const Mnemonics = require('../../../../src/Architectures/SMA/Mnemonics');
const Byte = require('../../../../src/DataTypes/Byte');
const Word = require('../../../../src/DataTypes/Word');
const random = require('../../random');

/**
 * @type {null|Assembler}
 */
let assembler = null;

beforeEach(() => {
    assembler = new Assembler;
});

test('supports move register to register', () => {
    const code = `
        .data
        .text
            mov eax, ebx
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toEqual([Mnemonics.mov, Mnemonics.eax, Mnemonics.ebx, new Byte(0x00)]);
});

test('supports move immediate to register', () => {
    const code = `
        .data
        .text
            mov eax, 1
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toEqual([Mnemonics.movi, Mnemonics.eax, new Byte(0x01), new Byte(0x00)]);
});

test('supports move memory to register', () => {
    const byte = new Byte(random(Byte));
    const wordLeft = new Byte(random(Byte));
    const wordRight = new Byte(random(Byte));
    const word = new Word(wordLeft, wordRight);
    const code = `
        .data
            value1 db 0x${byte.toInt().toString(16)}
            value2 dw 0x${word.toInt().toString(16)}
        .text
            mov eax, value1
            mov ebx, value2
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toEqual([
        Mnemonics.movmb, Mnemonics.eax, new Byte(0x00), new Byte(0x08),
        Mnemonics.movmw, Mnemonics.ebx, new Byte(0x00), new Byte(0x09),
        byte, wordLeft, wordRight
    ]);
});

test('supports syscall', () => {
    const byte = random(Byte);
    const code = `
        .data
            status db 0x${byte.toString(16)}
        .text
            mov eax, 1
            mov ebx, status
            syscall
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toEqual([
        Mnemonics.movi, Mnemonics.eax, new Byte(0x01), new Byte(0x00),
        Mnemonics.movmb, Mnemonics.ebx, new Byte(0x00), new Byte(0x0C),
        Mnemonics.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
        new Byte(byte),
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

    expect(bytes).toEqual([
        Mnemonics.movmb, Mnemonics.eax, new Byte(0x00), new Byte(0x04),
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

    expect(bytes).toEqual([
        Mnemonics.movi, Mnemonics.eax, new Byte(0x01), new Byte(0x00),
        Mnemonics.mov, Mnemonics.ebx, Mnemonics.eax, new Byte(0x00),
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

    expect(bytes).toEqual([
        Mnemonics.movi, Mnemonics.eax, new Byte(0x01), new Byte(0x00),
        Mnemonics.mov, Mnemonics.ebx, Mnemonics.eax, new Byte(0x00),
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

    expect(bytes).toEqual([
        Mnemonics.movi, Mnemonics.eax, new Byte(0x01), new Byte(0x00),
        Mnemonics.mov, Mnemonics.ebx, Mnemonics.eax, new Byte(0x00),
        Mnemonics.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
    ]);
});
