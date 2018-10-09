const Assembler = require('../../../../src/Assemblers/RASM/Assembler');
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
        mov eax, ebx
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Mnemonics.mov, Mnemonics.eax, Mnemonics.ebx, new Byte(0x00)]);
});

test('supports move immediate to register', () => {
    const value = random(Word);
    const code = `
        movi al, ${value}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Mnemonics.movi, Mnemonics.al, ...(new Word(value)).expand()]);
});

test('supports move immediate to memory', () => {
    const value = random(Byte);
    const code = `
        movim 0x08, 0x${value.toString(16)}
        movm al, 0x08
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movim, new Byte(0x00), new Byte(0x08), new Byte(value),
        Mnemonics.movm, Mnemonics.al, new Byte(0x00), new Byte(0x08),
    ]);
});

test('supports move immediate byte word to register pointer', () => {
    const value = random(Byte);
    const code = `
        movi ax, 0x08
        movipb ax, ${value}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movi, Mnemonics.ax, new Byte(0x00), new Byte(0x08),
        Mnemonics.movipb, Mnemonics.ax, new Byte(value), new Byte(0x00),
    ]);
});

test('supports move immediate word to register pointer', () => {
    const value = random(Word);
    const code = `
        movi ax, 0x08
        movipw ax, ${value}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movi, Mnemonics.ax, new Byte(0x00), new Byte(0x08),
        Mnemonics.movipw, Mnemonics.ax, ...(new Word(value)).expand(),
    ]);
});

test('supports move immediate to memory pointer', () => {
    const value = random(Byte);
    const code = `
        movi ax, 0x0E
        movrm 0x0C, ax
        movipm 0x0C, ${value}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movi, Mnemonics.ax, new Byte(0x00), new Byte(0x0E),
        Mnemonics.movrm, new Byte(0x00), new Byte(0x0C), Mnemonics.ax,
        Mnemonics.movipm, new Byte(0x00), new Byte(0x0C), new Byte(value),
    ]);
});

test('supports move memory to register', () => {
    const value = random(Byte);
    const wordLeft = random(Byte);
    const wordRight = random(Byte);
    const code = `
        movm al, 0x08
        movm bx, 0x09
        0x${value.toString(16)}0x${wordLeft.toString(16)}0x${wordRight.toString(16)}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movm, Mnemonics.al, new Byte(0x00), new Byte(0x08),
        Mnemonics.movm, Mnemonics.bx, new Byte(0x00), new Byte(0x09),
        new Byte(value), new Byte(wordLeft), new Byte(wordRight),
    ]);
});

test('supports move register pointer to register', () => {
    const value = new Double(random(Double));
    const valueb = value.expand();
    const code = `
        movi ax, 0x08
        movp eax, ax
        ${valueb.map(byte => '0x' + byte.uint().toString(16)).join(' ')}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movi, Mnemonics.ax, ...(new Word(0x08)).expand(),
        Mnemonics.movp, Mnemonics.eax, Mnemonics.ax, new Byte(0x00),
        ...valueb
    ]);
});

test('supports move register to memory', () => {
    const value = random(Byte);
    const code = `
        movm al, 0x0C
        movrm 0x0D, al
        movm bl, 0x0D
        0x${value.toString(16)}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movm, Mnemonics.al, new Byte(0x00), new Byte(0x0C),
        Mnemonics.movrm, new Byte(0x00), new Byte(0x0D), Mnemonics.al,
        Mnemonics.movm, Mnemonics.bl, new Byte(0x00), new Byte(0x0D),
        new Byte(value)
    ]);
});

test('supports syscall', () => {
    const value = random(Byte);
    const code = `
        movi al, 1
        movm bl, 0x0C
        syscall
        0x${value.toString(16)}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movi, Mnemonics.al, new Byte(0x00), new Byte(0x01),
        Mnemonics.movm, Mnemonics.bl, new Byte(0x00), new Byte(0x0C),
        Mnemonics.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
        new Byte(value),
    ]);
});

test('supports multiple spaces between tokens', () => {
    const code = `
        movm     ax,    0x04
          0x02    0x04
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movm, Mnemonics.ax, new Byte(0x00), new Byte(0x04),
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

    expect(bytes).toStrictEqual([
        Mnemonics.movi, Mnemonics.al, new Byte(0x00), new Byte(0x01),
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

    expect(bytes).toStrictEqual([
        Mnemonics.movi, Mnemonics.al, new Byte(0x00), new Byte(0x01),
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

    expect(bytes).toStrictEqual([
        Mnemonics.movi, Mnemonics.al, new Byte(0x00), new Byte(0x01),
        Mnemonics.mov, Mnemonics.bl, Mnemonics.al, new Byte(0x00),
        Mnemonics.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
    ]);
});
