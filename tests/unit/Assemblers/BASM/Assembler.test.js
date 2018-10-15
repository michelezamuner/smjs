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
        .text
            mov eax, ebx
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Mnemonics.mov, Mnemonics.eax, Mnemonics.ebx, new Byte(0x00)]);
});

test('supports move immediate to register', () => {
    const value = random(Word);
    const code = `
        .text
            mov al, ${value}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Mnemonics.movi, Mnemonics.al, ...(new Word(value)).expand()]);
});

test('supports move immediate to byte memory', () => {
    const value = random(Byte);
    const code = `
        .bss
            value db
        .text
            mov value, ${value}
            mov al, value
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movim, new Byte(0x00), new Byte(0x08), new Byte(value),
        Mnemonics.movm, Mnemonics.al, new Byte(0x00), new Byte(0x08),
    ]);
});

test('supports move immediate to word memory', () => {
    const value = random(Byte);
    const code = `
        .bss
            value dw
        .text
            mov value, ${value}
            mov ax, value
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movim, new Byte(0x00), new Byte(0x09), new Byte(value),
        Mnemonics.movm, Mnemonics.ax, new Byte(0x00), new Byte(0x08),
    ]);
});

test('supports move immediate to double memory', () => {
    const value = random(Byte);
    const code = `
        .bss
            value dd
        .text
            mov value, ${value}
            mov eax, value
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movim, new Byte(0x00), new Byte(0x0B), new Byte(value),
        Mnemonics.movm, Mnemonics.eax, new Byte(0x00), new Byte(0x08),
    ]);
});

test('supports move immediate to byte register pointer', () => {
    const value = random(Word);
    const code = `
        .bss
            value db
        .text
            mov ax, [value]
            mov [ax], ${value}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movi, Mnemonics.ax, new Byte(0x00), new Byte(0x08),
        Mnemonics.movipb, Mnemonics.ax, ...(new Word(value)).expand(),
    ]);
});

test('supports move immediate to word register pointer', () => {
    const value = random(Word);
    const code = `
        .bss
            value dw
        .text
            mov ax, [value]
            mov [ax], ${value}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movi, Mnemonics.ax, new Byte(0x00), new Byte(0x08),
        Mnemonics.movipw, Mnemonics.ax, ...(new Word(value)).expand(),
    ]);
});

test('supports move immediate to double register pointer', () => {
    const value = random(Word);
    const code = `
        .bss
            value dd
        .text
            mov ax, [value]
            mov [ax], ${value}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movi, Mnemonics.ax, new Byte(0x00), new Byte(0x08),
        Mnemonics.movipd, Mnemonics.ax, ...(new Word(value)).expand(),
    ]);
});

test('supports move immediate to memory pointer', () => {
    const value = random(Byte);
    const code = `
        .bss
            value db
            valuePtr dw
        .text
            mov ax, [value]
            mov valuePtr, ax
            mov [valuePtr], ${value}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movi, Mnemonics.ax, new Byte(0x00), new Byte(0x0C),
        Mnemonics.movrm, new Byte(0x00), new Byte(0x0D), Mnemonics.ax,
        Mnemonics.movimp, new Byte(0x00), new Byte(0x0D), new Byte(value),
    ]);
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

test('supports move register pointer to register', () => {
    const value = new Double(random(Double));
    const valueb = value.expand();
    const code = `
        .data
            value   dd  0x${value.uint().toString(16)}
        .text
            mov ax, [value]
            mov eax, [ax]
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movi, Mnemonics.ax, new Byte(0x00), new Byte(0x08),
        Mnemonics.movp, Mnemonics.eax, Mnemonics.ax, new Byte(0x00),
        ...valueb
    ]);
});

test('supports move register to memory', () => {
    const value = random(Byte);
    const code = `
        .bss
            value   db
        .text
            mov al, ${value}
            mov value, al
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movi, Mnemonics.al, new Byte(0x00), new Byte(value),
        Mnemonics.movrm, new Byte(0x00), new Byte(0x08), Mnemonics.al,
    ]);
});

test('supports move register to register pointer', () => {
    const value = random(Byte);
    const code = `
        .bss
            value   db
        .text
            mov al, ${value}
            mov bx, [value]
            mov [bx], al
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movi, Mnemonics.al, new Byte(0x00), new Byte(value),
        Mnemonics.movi, Mnemonics.bx, new Byte(0x00), new Byte(0x0C),
        Mnemonics.movrp, Mnemonics.bx, Mnemonics.al, new Byte(0x00),
    ]);
});

test('supports move register to memory pointer', () => {
    const value = random(Word);
    const code = `
        .bss
            value       dw
            valuePtr    dw
        .text
            mov ax, [value]
            mov valuePtr, ax
            mov bx, ${value}
            mov [valuePtr], bx
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movi, Mnemonics.ax, new Byte(0x00), new Byte(0x10),
        Mnemonics.movrm, new Byte(0x00), new Byte(0x12), Mnemonics.ax,
        Mnemonics.movi, Mnemonics.bx, ...(new Word(value)).expand(),
        Mnemonics.movrmp, new Byte(0x00), new Byte(0x12), Mnemonics.bx,
    ]);
});

test('supports move from table of bytes', () => {
    const value1 = random(Byte);
    const value2 = random(Byte);
    const value3 = random(Byte);
    const value4 = random(Byte);
    const value = random(Word);
    const code = `
        .data
            table   db  ${value1} ${value2} ${value3} ${value4}
            value   dw  ${value}
        .text
            mov al, table[0]
            mov bl, table[1]
            mov cl, table[2]
            mov dl, table[3]
            mov ax, value
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movm, Mnemonics.al, new Byte(0x00), new Byte(0x14),
        Mnemonics.movm, Mnemonics.bl, new Byte(0x00), new Byte(0x15),
        Mnemonics.movm, Mnemonics.cl, new Byte(0x00), new Byte(0x16),
        Mnemonics.movm, Mnemonics.dl, new Byte(0x00), new Byte(0x17),
        Mnemonics.movm, Mnemonics.ax, new Byte(0x00), new Byte(0x18),
        new Byte(value1), new Byte(value2), new Byte(value3), new Byte(value4),
        ...(new Word(value)).expand()
    ]);
});

test('supports move from table of words', () => {
    const value1 = random(Word);
    const value2 = random(Word);
    const value3 = random(Word);
    const value4 = random(Word);
    const value = random(Word);
    const code = `
        .data
            table   dw  ${value1} ${value2} ${value3} ${value4}
            value   dw  ${value}
        .text
            mov ax, table[0]
            mov bx, table[1]
            mov cx, table[2]
            mov dx, table[3]
            mov ax, value
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movm, Mnemonics.ax, new Byte(0x00), new Byte(0x14),
        Mnemonics.movm, Mnemonics.bx, new Byte(0x00), new Byte(0x16),
        Mnemonics.movm, Mnemonics.cx, new Byte(0x00), new Byte(0x18),
        Mnemonics.movm, Mnemonics.dx, new Byte(0x00), new Byte(0x1A),
        Mnemonics.movm, Mnemonics.ax, new Byte(0x00), new Byte(0x1C),
        ...(new Word(value1)).expand(), ...(new Word(value2)).expand(),
        ...(new Word(value3)).expand(), ...(new Word(value4)).expand(),
        ...(new Word(value)).expand()
    ]);
});

test('supports move immediate to table of bytes', () => {
    const value = random(Byte);
    const value1 = random(Byte);
    const value2 = random(Byte);
    const value3 = random(Byte);
    const other = random(Byte);
    const code = `
        .bss
            value   db
            table   db  times 3
            other   dw
        .text
            mov value, ${value}
            mov table[0], ${value1}
            mov table[1], ${value2}
            mov table[2], ${value3}
            mov other, ${other}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movim, new Byte(0x00), new Byte(0x14), new Byte(value),
        Mnemonics.movim, new Byte(0x00), new Byte(0x15), new Byte(value1),
        Mnemonics.movim, new Byte(0x00), new Byte(0x16), new Byte(value2),
        Mnemonics.movim, new Byte(0x00), new Byte(0x17), new Byte(value3),
        Mnemonics.movim, new Byte(0x00), new Byte(0x19), new Byte(other),
    ]);
});

test('supports move immediate to table of words', () => {
    const value = random(Byte);
    const value1 = random(Byte);
    const value2 = random(Byte);
    const value3 = random(Byte);
    const other = random(Byte);
    const code = `
        .bss
            value   db
            table   dw  times 3
            other   dw
        .text
            mov value, ${value}
            mov table[0], ${value1}
            mov table[1], ${value2}
            mov table[2], ${value3}
            mov other, ${other}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movim, new Byte(0x00), new Byte(0x14), new Byte(value),
        Mnemonics.movim, new Byte(0x00), new Byte(0x16), new Byte(value1),
        Mnemonics.movim, new Byte(0x00), new Byte(0x18), new Byte(value2),
        Mnemonics.movim, new Byte(0x00), new Byte(0x1A), new Byte(value3),
        Mnemonics.movim, new Byte(0x00), new Byte(0x1C), new Byte(other),
    ]);
});

test('supports move register to table of bytes', () => {
    const value1 = random(Byte);
    const value2 = random(Byte);
    const code = `
        .bss
            table   db  times 2
        .text
            mov al, ${value1}
            mov bl, ${value2}
            mov table[0], al
            mov table[1], bl
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movi, Mnemonics.al, ...(new Word(value1)).expand(),
        Mnemonics.movi, Mnemonics.bl, ...(new Word(value2)).expand(),
        Mnemonics.movrm, new Byte(0x00), new Byte(0x10), Mnemonics.al,
        Mnemonics.movrm, new Byte(0x00), new Byte(0x11), Mnemonics.bl,
    ]);
});

test('supports move register to table of words', () => {
    const value1 = random(Word);
    const value2 = random(Word);
    const value = random(Byte);
    const code = `
        .bss
            table   dw  times 2
            value   db
        .text
            mov ax, ${value1}
            mov bx, ${value2}
            mov table[0], ax
            mov table[1], bx
            mov value, ${value}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movi, Mnemonics.ax, ...(new Word(value1)).expand(),
        Mnemonics.movi, Mnemonics.bx, ...(new Word(value2)).expand(),
        Mnemonics.movrm, new Byte(0x00), new Byte(0x14), Mnemonics.ax,
        Mnemonics.movrm, new Byte(0x00), new Byte(0x16), Mnemonics.bx,
        Mnemonics.movim, new Byte(0x00), new Byte(0x18), new Byte(value),
    ]);
});

test('supports move register to table of doubles', () => {
    const value1 = random(Word);
    const value2 = random(Word);
    const value = random(Byte);
    const code = `
        .bss
            table   dd  times 2
            value   db
        .text
            mov eax, ${value1}
            mov ebx, ${value2}
            mov table[0], eax
            mov table[1], ebx
            mov value, ${value}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movi, Mnemonics.eax, ...(new Word(value1)).expand(),
        Mnemonics.movi, Mnemonics.ebx, ...(new Word(value2)).expand(),
        Mnemonics.movrm, new Byte(0x00), new Byte(0x14), Mnemonics.eax,
        Mnemonics.movrm, new Byte(0x00), new Byte(0x18), Mnemonics.ebx,
        Mnemonics.movim, new Byte(0x00), new Byte(0x1C), new Byte(value),
    ]);
});

test('supports characters as immediate values', () => {
    const code = `
        .data
            char    db  '!'
        .text
            mov al, char
            mov bl, '*'
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movm, Mnemonics.al, new Byte(0x00), new Byte(0x08),
        Mnemonics.movi, Mnemonics.bl, new Byte(0x00), new Byte(0x2A),
        new Byte(0x21),
    ]);
});

test('supports strings definitions', () => {
    const code = `
        .data
            msg    db  "Hello, World!"
        .text
            mov al, msg[0]
            mov bl, msg[5]
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movm, Mnemonics.al, new Byte(0x00), new Byte(0x08),
        Mnemonics.movm, Mnemonics.bl, new Byte(0x00), new Byte(0x0D),
        new Byte(0x48), new Byte(0x65), new Byte(0x6C), new Byte(0x6C),
        new Byte(0x6F), new Byte(0x2C), new Byte(0x20), new Byte(0x57),
        new Byte(0x6F), new Byte(0x72), new Byte(0x6C), new Byte(0x64),
        new Byte(0x21),
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

test('converts back escaped newline characters', () => {
    const code = `
        .data
            string db "String\\nwith\\nnewlines"
        .text
            mov eax, 1
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Mnemonics.movi, Mnemonics.eax, new Byte(0x00), new Byte(0x01),
        new Byte(83), new Byte(116), new Byte(114), new Byte(105),
        new Byte(110), new Byte(103), new Byte(10), new Byte(119),
        new Byte(105), new Byte(116), new Byte(104), new Byte(10),
        new Byte(110), new Byte(101), new Byte(119), new Byte(108),
        new Byte(105), new Byte(110), new Byte(101), new Byte(115),
    ]);
});
