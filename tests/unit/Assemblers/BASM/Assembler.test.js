const Assembler = require('../../../../src/Assemblers/BASM/Assembler');
const Mnemonics = require('../../../../src/Architectures/SMA/Mnemonics');
const Byte = require('../../../../src/DataTypes/Byte');
const Word = require('../../../../src/DataTypes/Word');
const Double = require('../../../../src/DataTypes/Double');
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

    expect(bytes).toStrictEqual([Mnemonics.mov, Mnemonics.eax, Mnemonics.ebx, new Byte(0x00)]);
});

test('supports move immediate to register', () => {
    const code = `
        .data
        .text
            mov al, 1
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Mnemonics.movi, Mnemonics.al, new Byte(0x00), new Byte(0x01)]);
});

test('supports move memory to register', () => {
    const value1 = new Word(random(Word));
    const value2 = new Byte(random(Byte));
    const value3 = new Double(0x01020304);
    const code = `
        .data
            valueA dw 0x${value1.uint().toString(16)}
            valueB db 0x${value2.uint().toString(16)}
            valueC dd 0x${value3.uint().toString(16)}
        .text
            mov eax, valueA
            mov ebx, valueB
            mov ecx, valueC
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movm, Mnemonics.eax, new Byte(0x00), new Byte(0x0C),
        Mnemonics.movm, Mnemonics.ebx, new Byte(0x00), new Byte(0x0E),
        Mnemonics.movm, Mnemonics.ecx, new Byte(0x00), new Byte(0x0F),
        ...value1.expand(), value2,
        ...value3.expand(),
    ]);
});

test('supports syscall', () => {
    const byte = random(Byte);
    const code = `
        .data
            status db 0x${byte.toString(16)}
        .text
            mov al, 1
            mov bl, status
            syscall
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movi, Mnemonics.al, new Byte(0x00), new Byte(0x01),
        Mnemonics.movm, Mnemonics.bl, new Byte(0x00), new Byte(0x0C),
        Mnemonics.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
        new Byte(byte),
    ]);
});

test('supports multiple spaces between tokens', () => {
    const code = `
        .data
            value   db  0x01
        .text
            mov     al,    value
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movm, Mnemonics.al, new Byte(0x00), new Byte(0x04),
        new Byte(0x01)
    ]);
});

test('accepts empty code', () => {
    const bytes = assembler.assemble('');

    expect(bytes).toStrictEqual([]);
});

test('accepts empty lines', () => {
    const code = `
        .data
        
        .text
        
            mov al, 1
        
            mov bl, al
        
            syscall
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movi, Mnemonics.al, new Byte(0x00), new Byte(0x01),
        Mnemonics.mov, Mnemonics.bl, Mnemonics.al, new Byte(0x00),
        Mnemonics.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
    ]);
});

test('accepts comment lines', () => {
    const code = `
        .data
        .text
            mov al, 1
            ; comment line
            mov bl, al
            ; another comment line
            syscall
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movi, Mnemonics.al, new Byte(0x00), new Byte(0x01),
        Mnemonics.mov, Mnemonics.bl, Mnemonics.al, new Byte(0x00),
        Mnemonics.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
    ]);
});

test('accepts inline comments', () => {
    const code = `
        .data
        .text
            mov al, 1    ; inline comment
            mov bl, al  ; another inline comment
            syscall
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movi, Mnemonics.al, new Byte(0x00), new Byte(0x01),
        Mnemonics.mov, Mnemonics.bl, Mnemonics.al, new Byte(0x00),
        Mnemonics.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
    ]);
});
