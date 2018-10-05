const Assembler = require('../../../../src/Assemblers/RASM/Assembler');
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

test('supports move with register addressing', () => {
    const code = `
        mov eax, ebx
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toEqual([Mnemonics.mov, Mnemonics.eax, Mnemonics.ebx, new Byte(0x00)]);
});

test('supports move with immediate addressing', () => {
    const code = `
        movi eax, 1
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toEqual([Mnemonics.movi, Mnemonics.eax, new Byte(0x01), new Byte(0x00)])
});

test('supports move with direct memory addressing from memory into register', () => {
    const byte = random(Byte);
    const wordLeft = random(Byte);
    const wordRight = random(Byte);
    const code = `
        movmb eax, 0x08
        movmw ebx, 0x09
        0x${byte.toString(16)}0x${wordLeft.toString(16)}0x${wordRight.toString(16)}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toEqual([
        Mnemonics.movmb, Mnemonics.eax, new Byte(0x00), new Byte(0x08),
        Mnemonics.movmw, Mnemonics.ebx, new Byte(0x00), new Byte(0x09),
        new Byte(byte), new Byte(wordLeft), new Byte(wordRight),
    ]);
});

test('supports move with direct memory addressing from register into memory', () => {
    const byte = random(Byte);
    const code = `
        movmb eax, 0x0C
        movmr 0x0D, eax
        movmb ebx, 0x0D
        0x${byte.toString(16)}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toEqual([
        Mnemonics.movmb, Mnemonics.eax, new Byte(0x00), new Byte(0x0C),
        Mnemonics.movmr, new Byte(0x00), new Byte(0x0D), Mnemonics.eax,
        Mnemonics.movmb, Mnemonics.ebx, new Byte(0x00), new Byte(0x0D),
        new Byte(byte)
    ]);
});

test('supports move with direct memory addressing from immediate value', () => {
    const byte = random(Byte);
    const code = `
        movmi 0x08, 0x${byte.toString(16)}
        movmb eax, 0x08
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toEqual([
        Mnemonics.movmi, new Byte(0x00), new Byte(0x08), new Byte(byte),
        Mnemonics.movmb, Mnemonics.eax, new Byte(0x00), new Byte(0x08),
    ]);
});

test('supports syscall', () => {
    const word = random(Word);
    const code = `
        movi eax, 0x01
        movmb ebx, 0x${word.toString(16)}
        syscall
        0x04
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toEqual([
        Mnemonics.movi, Mnemonics.eax, new Byte(0x01), new Byte(0x00),
        Mnemonics.movmb, Mnemonics.ebx, ...(new Word(word)).toBytes(),
        Mnemonics.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
        new Byte(0x04),
    ]);
});

test('supports multiple spaces between tokens', () => {
    const code = `
        movmw     eax,    0x04
          0x02    0x04
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toEqual([
        Mnemonics.movmw, Mnemonics.eax, new Byte(0x00), new Byte(0x04),
        new Byte(0x02), new Byte(0x04)
    ]);
});

test('accepts empty code', () => {
    const bytes = assembler.assemble('');

    expect(bytes).toEqual([]);
});

test('accepts empty lines', () => {
    const code = `
        movi eax, 1
        
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
        movi eax, 1
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
        movi eax, 1    ; inline comment
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
