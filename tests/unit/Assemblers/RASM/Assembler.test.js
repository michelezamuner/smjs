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

test('supports move register to register', () => {
    const code = `
        mov eax, ebx
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toEqual([Mnemonics.mov, Mnemonics.eax, Mnemonics.ebx, new Byte(0x00)]);
});

test('supports move immediate to register', () => {
    const code = `
        movi al, 1
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toEqual([Mnemonics.movi, Mnemonics.al, new Byte(0x01), new Byte(0x00)])
});

test('supports move immediate to memory', () => {
    const byte = random(Byte);
    const code = `
        movim 0x08, 0x${byte.toString(16)}
        movmb al, 0x08
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toEqual([
        Mnemonics.movim, new Byte(0x00), new Byte(0x08), new Byte(byte),
        Mnemonics.movmb, Mnemonics.al, new Byte(0x00), new Byte(0x08),
    ]);
});

test('supports move memory to register', () => {
    const byte = random(Byte);
    const wordLeft = random(Byte);
    const wordRight = random(Byte);
    const code = `
        movmb al, 0x08
        movmw bx, 0x09
        0x${byte.toString(16)}0x${wordLeft.toString(16)}0x${wordRight.toString(16)}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toEqual([
        Mnemonics.movmb, Mnemonics.al, new Byte(0x00), new Byte(0x08),
        Mnemonics.movmw, Mnemonics.bx, new Byte(0x00), new Byte(0x09),
        new Byte(byte), new Byte(wordLeft), new Byte(wordRight),
    ]);
});

test('supports move register to memory', () => {
    const byte = random(Byte);
    const code = `
        movmb al, 0x0C
        movrm 0x0D, al
        movmb bl, 0x0D
        0x${byte.toString(16)}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toEqual([
        Mnemonics.movmb, Mnemonics.al, new Byte(0x00), new Byte(0x0C),
        Mnemonics.movrm, new Byte(0x00), new Byte(0x0D), Mnemonics.al,
        Mnemonics.movmb, Mnemonics.bl, new Byte(0x00), new Byte(0x0D),
        new Byte(byte)
    ]);
});

test('supports syscall', () => {
    const value = random(Byte);
    const code = `
        movi al, 1
        movmb bl, 0x0C
        syscall
        0x${value.toString(16)}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toEqual([
        Mnemonics.movi, Mnemonics.al, new Byte(0x01), new Byte(0x00),
        Mnemonics.movmb, Mnemonics.bl, new Byte(0x00), new Byte(0x0C),
        Mnemonics.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
        new Byte(value),
    ]);
});

test('supports multiple spaces between tokens', () => {
    const code = `
        movmw     ax,    0x04
          0x02    0x04
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toEqual([
        Mnemonics.movmw, Mnemonics.ax, new Byte(0x00), new Byte(0x04),
        new Byte(0x02), new Byte(0x04)
    ]);
});

test('accepts empty code', () => {
    const bytes = assembler.assemble('');

    expect(bytes).toEqual([]);
});

test('accepts empty lines', () => {
    const code = `
        movi al, 1
        
        mov bl, al
        
        syscall
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toEqual([
        Mnemonics.movi, Mnemonics.al, new Byte(0x01), new Byte(0x00),
        Mnemonics.mov, Mnemonics.bl, Mnemonics.al, new Byte(0x00),
        Mnemonics.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
    ]);
});

test('accepts comment lines', () => {
    const code = `
        movi al, 1
        ; comment line
        mov bl, al
        ; another comment line
        syscall
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toEqual([
        Mnemonics.movi, Mnemonics.al, new Byte(0x01), new Byte(0x00),
        Mnemonics.mov, Mnemonics.bl, Mnemonics.al, new Byte(0x00),
        Mnemonics.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
    ]);
});

test('accepts inline comments', () => {
    const code = `
        movi al, 1    ; inline comment
        mov bl, al  ; another inline comment
        syscall
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toEqual([
        Mnemonics.movi, Mnemonics.al, new Byte(0x01), new Byte(0x00),
        Mnemonics.mov, Mnemonics.bl, Mnemonics.al, new Byte(0x00),
        Mnemonics.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
    ]);
});
