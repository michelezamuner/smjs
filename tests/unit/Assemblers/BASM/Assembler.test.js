const Assembler = require('../../../../src/Assemblers/BASM/Assembler');
const Register = require('../../../../src/Architectures/SMA/Mnemonics').register;
const Instruction = require('../../../../src/Architectures/SMA/Mnemonics').instruction;
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

test('supports multiple spaces between tokens', () => {
    const code = `
        .data
            value   db  0x01
        .text
            mov     al,    value
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.movm, Register.al, new Byte(0x00), new Byte(0x04),
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
        Instruction.movi, Register.al, new Byte(0x00), new Byte(0x01),
        Instruction.mov, Register.bl, Register.al, new Byte(0x00),
        Instruction.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
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
        Instruction.movi, Register.al, new Byte(0x00), new Byte(0x01),
        Instruction.mov, Register.bl, Register.al, new Byte(0x00),
        Instruction.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
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
        Instruction.movi, Register.al, new Byte(0x00), new Byte(0x01),
        Instruction.mov, Register.bl, Register.al, new Byte(0x00),
        Instruction.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
    ]);
});

test('converts back escaped newline characters', () => {
    const code = `
        .data
            string db "String" 0x0A "with" 0x0A "newlines"
        .text
            mov eax, 1
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.movi, Register.eax, new Byte(0x00), new Byte(0x01),
        new Byte(83), new Byte(116), new Byte(114), new Byte(105),
        new Byte(110), new Byte(103), new Byte(10), new Byte(119),
        new Byte(105), new Byte(116), new Byte(104), new Byte(10),
        new Byte(110), new Byte(101), new Byte(119), new Byte(108),
        new Byte(105), new Byte(110), new Byte(101), new Byte(115),
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
        Instruction.movm, Register.al, new Byte(0x00), new Byte(0x08),
        Instruction.movi, Register.bl, new Byte(0x00), new Byte(0x2A),
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
        Instruction.movm, Register.al, new Byte(0x00), new Byte(0x08),
        Instruction.movm, Register.bl, new Byte(0x00), new Byte(0x0D),
        new Byte(0x48), new Byte(0x65), new Byte(0x6C), new Byte(0x6C),
        new Byte(0x6F), new Byte(0x2C), new Byte(0x20), new Byte(0x57),
        new Byte(0x6F), new Byte(0x72), new Byte(0x6C), new Byte(0x64),
        new Byte(0x21),
    ]);
});

test('supports mixed strings, characters and bytes', () => {
    const code = `
        .data
            msg     db "Hello" ',' 0x20 "World" 0x21
        .text
            mov al, msg[0]
            mov bl, msg[5]
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.movm, Register.al, new Byte(0x00), new Byte(0x08),
        Instruction.movm, Register.bl, new Byte(0x00), new Byte(0x0D),
        new Byte(0x48), new Byte(0x65), new Byte(0x6C), new Byte(0x6C),
        new Byte(0x6F), new Byte(0x2C), new Byte(0x20), new Byte(0x57),
        new Byte(0x6F), new Byte(0x72), new Byte(0x6C), new Byte(0x64),
        new Byte(0x21),
    ]);
});

test('fails if invalid opcode is used', () => {
    const opcode = 'invalid';
    const code = `
        .text
            ${opcode} eax, 1
    `;

    expect(() => assembler.assemble(code)).toThrow(new Error(`Invalid opcode: ${opcode}`));
});

test('fails if invalid operands to move instruction', () => {
    const code = `
        .text
            mov 0xFF, 0x12
    `;

    expect(() => assembler.assemble(code)).toThrow(new Error('Invalid operands to mov instruction'));
});

test('supports move register to register', () => {
    const code = `
        .text
            mov eax, ebx
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.mov, Register.eax, Register.ebx, new Byte(0x00)]);
});

test('supports move immediate to register', () => {
    const value = random(Word);
    const code = `
        .text
            mov al, ${value}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.movi, Register.al, ...value.expand()]);
});

test('supports move immediate to byte memory', () => {
    const value = random(Byte);
    const code = `
        .bss
            value db
        .text
            mov value, ${value}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.movim, new Byte(0x00), new Byte(0x04), value]);
});

test('supports move immediate to word memory', () => {
    const value = random(Byte);
    const code = `
        .bss
            value dw
        .text
            mov value, ${value}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.movim, new Byte(0x00), new Byte(0x05), value]);
});

test('supports move immediate to double memory', () => {
    const value = random(Byte);
    const code = `
        .bss
            value dd
        .text
            mov value, ${value}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.movim, new Byte(0x00), new Byte(0x07), value]);
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
        Instruction.movi, Register.ax, new Byte(0x00), new Byte(0x08),
        Instruction.movipb, Register.ax, ...value.expand(),
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
        Instruction.movi, Register.ax, new Byte(0x00), new Byte(0x08),
        Instruction.movipw, Register.ax, ...value.expand(),
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
        Instruction.movi, Register.ax, new Byte(0x00), new Byte(0x08),
        Instruction.movipd, Register.ax, ...value.expand(),
    ]);
});

test('supports move immediate to memory pointer', () => {
    const value = random(Byte);
    const code = `
        .bss
            valuePtr dw
        .text
            mov valuePtr, ax
            mov [valuePtr], ${value}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.movrm, new Byte(0x00), new Byte(0x08), Register.ax,
        Instruction.movimp, new Byte(0x00), new Byte(0x08), value,
    ]);
});

test('supports move memory to register', () => {
    const value1 = random(Word);
    const code = `
        .data
            valueA dw ${value1}
        .text
            mov eax, valueA
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.movm, Register.eax, new Byte(0x00), new Byte(0x04),
        ...value1.expand()
    ]);
});

test('supports move register pointer to register', () => {
    const value = random(Double);
    const code = `
        .data
            value   dd  ${value}
        .text
            mov ax, [value]
            mov eax, [ax]
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.movi, Register.ax, new Byte(0x00), new Byte(0x08),
        Instruction.movp, Register.eax, Register.ax, new Byte(0x00),
        ...value.expand()
    ]);
});

test('supports move register to memory', () => {
    const code = `
        .bss
            value   db
        .text
            mov value, al
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.movrm, new Byte(0x00), new Byte(0x04), Register.al,
    ]);
});

test('supports move register to register pointer', () => {
    const code = `
        .bss
            value   db
        .text
            mov bx, [value]
            mov [bx], al
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.movi, Register.bx, new Byte(0x00), new Byte(0x08),
        Instruction.movrp, Register.bx, Register.al, new Byte(0x00),
    ]);
});

test('supports move register to memory pointer', () => {
    const code = `
        .bss
            valuePtr    dw
        .text
            mov valuePtr, ax
            mov [valuePtr], bx
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.movrm, new Byte(0x00), new Byte(0x08), Register.ax,
        Instruction.movrmp, new Byte(0x00), new Byte(0x08), Register.bx,
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
        Instruction.movm, Register.al, new Byte(0x00), new Byte(0x14),
        Instruction.movm, Register.bl, new Byte(0x00), new Byte(0x15),
        Instruction.movm, Register.cl, new Byte(0x00), new Byte(0x16),
        Instruction.movm, Register.dl, new Byte(0x00), new Byte(0x17),
        Instruction.movm, Register.ax, new Byte(0x00), new Byte(0x18),
        value1, value2, value3, value4,
        ...value.expand()
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
        Instruction.movm, Register.ax, new Byte(0x00), new Byte(0x14),
        Instruction.movm, Register.bx, new Byte(0x00), new Byte(0x16),
        Instruction.movm, Register.cx, new Byte(0x00), new Byte(0x18),
        Instruction.movm, Register.dx, new Byte(0x00), new Byte(0x1A),
        Instruction.movm, Register.ax, new Byte(0x00), new Byte(0x1C),
        ...value1.expand(), ...value2.expand(),
        ...value3.expand(), ...value4.expand(),
        ...value.expand()
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
        Instruction.movim, new Byte(0x00), new Byte(0x14), value,
        Instruction.movim, new Byte(0x00), new Byte(0x15), value1,
        Instruction.movim, new Byte(0x00), new Byte(0x16), value2,
        Instruction.movim, new Byte(0x00), new Byte(0x17), value3,
        Instruction.movim, new Byte(0x00), new Byte(0x19), other,
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
        Instruction.movim, new Byte(0x00), new Byte(0x14), value,
        Instruction.movim, new Byte(0x00), new Byte(0x16), value1,
        Instruction.movim, new Byte(0x00), new Byte(0x18), value2,
        Instruction.movim, new Byte(0x00), new Byte(0x1A), value3,
        Instruction.movim, new Byte(0x00), new Byte(0x1C), other,
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
        Instruction.movi, Register.al, new Byte(0x00), value1,
        Instruction.movi, Register.bl, new Byte(0x00), value2,
        Instruction.movrm, new Byte(0x00), new Byte(0x10), Register.al,
        Instruction.movrm, new Byte(0x00), new Byte(0x11), Register.bl,
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
        Instruction.movi, Register.ax, ...value1.expand(),
        Instruction.movi, Register.bx, ...value2.expand(),
        Instruction.movrm, new Byte(0x00), new Byte(0x14), Register.ax,
        Instruction.movrm, new Byte(0x00), new Byte(0x16), Register.bx,
        Instruction.movim, new Byte(0x00), new Byte(0x18), value,
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
        Instruction.movi, Register.eax, ...value1.expand(),
        Instruction.movi, Register.ebx, ...value2.expand(),
        Instruction.movrm, new Byte(0x00), new Byte(0x14), Register.eax,
        Instruction.movrm, new Byte(0x00), new Byte(0x18), Register.ebx,
        Instruction.movim, new Byte(0x00), new Byte(0x1C), value,
    ]);
});

test('supports increment', () => {
    const code = `
        .text
            inc eax
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.inc, Register.eax, new Byte(0x00), new Byte(0x00)]);
});

test('supports decrement', () => {
    const code = `
        .text
            dec eax
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.dec, Register.eax, new Byte(0x00), new Byte(0x00)]);
});

test('fails if invalid operands to add', () => {
    const code = `
        .text
            add 0xFF, 0xFF
    `;

    expect(() => assembler.assemble(code)).toThrow(new Error('Invalid operands to add instruction'));
});

test('supports add immediate to register', () => {
    const value = random(Word);
    const code = `
        .text
            add eax, ${value}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.addi, Register.eax, ...value.expand()]);
});

test('supports add register to register', () => {
    const code = `
        .text
            add eax, ebx
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.add, Register.eax, Register.ebx, new Byte(0x00)]);
});

test('supports add memory to register', () => {
    const value = random(Double);
    const code = `
        .data
            value   dd  ${value}
        .text
            add eax, value
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.addm, Register.eax, new Byte(0x00), new Byte(0x04),
        ...value.expand(),
    ]);
});

test('fails if invalid operands to subtract', () => {
    const code = `
        .text
            sub 0xFF, 0xFF
    `;

    expect(() => assembler.assemble(code)).toThrow(new Error('Invalid operands to sub instruction'));
});

test('supports subtract immediate from register', () => {
    const value = random(Word);
    const code = `
        .text
            sub eax, ${value}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.subi, Register.eax, ...value.expand()]);
});

test('supports subtract register from register', () => {
    const code = `
        .text
            sub eax, ebx
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.sub, Register.eax, Register.ebx, new Byte(0x00)]);
});

test('supports subtract memory from register', () => {
    const value = random(Double);
    const code = `
        .data
            value   dd  ${value}
        .text
            sub eax, value
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.subm, Register.eax, new Byte(0x00), new Byte(0x04),
        ...value.expand(),
    ]);
});

test('fails if invalid operands to multiply', () => {
    const code = `
        .text
            mul 0xFF, 0x12
    `;

    expect(() => assembler.assemble(code)).toThrow(new Error(`Invalid operands to mul instruction`));
});

test('supports multiply register by immediate', () => {
    const value = random(Byte);
    const code = `
        .text
            mul al, ${value}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.muli, Register.al, new Byte(0x00), value]);
});

test('supports multiply register by register', () => {
    const couples = [['al', 'bh'], ['eax', 'edx'], ['cx', 'ax']];

    for (const couple of couples) {
        const code = `
            .text
                mul ${couple[0]}, ${couple[1]}
        `;

        const bytes = assembler.assemble(code);

        expect(bytes).toStrictEqual([Instruction.mul, Register[couple[0]], Register[couple[1]], new Byte(0x00)]);
    }
});

test('supports multiply register by memory', () => {
    const value = random(Word);
    const code = `
        .data
            x   dw  ${value}
        .text
            mul ax, x
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.mulm, Register.ax, new Byte(0x00), new Byte(0x04),
        ...value.expand(),
    ]);
});

test('supports compare to immediate', () => {
    const value = random(Word);
    const code = `
        .text
            cmp eax, ${value}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.cmpi, Register.eax, ...value.expand()]);
});

test('supports compare to register', () => {
    const code = `
        .text
            cmp eax, ebx
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.cmp, Register.eax, Register.ebx, new Byte(0x00)]);
});

test('supports compare to memory', () => {
    const value = random(Double);
    const code = `
        .data
            x   dd  ${value}
        .text
            cmp eax, x
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.cmpm, Register.eax, new Byte(0x00), new Byte(0x04),
        ...value.expand(),
    ]);
});

test('supports unconditional jump', () => {
    const code = `
        .text
            jmp exit
            exit:
            syscall
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.jmp, new Byte(0x00), new Byte(0x04), new Byte(0x00),
        Instruction.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
    ]);
});

test('supports jump if equal', () => {
    const code = `
        .text
            je exit
            exit:
            syscall
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.je, new Byte(0x00), new Byte(0x04), new Byte(0x00),
        Instruction.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
    ]);
});

test('supports jump if not equal', () => {
    const code = `
        .text
            jne exit
            exit:
            syscall
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.jne, new Byte(0x00), new Byte(0x04), new Byte(0x00),
        Instruction.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
    ]);
});

test('supports jump if greater', () => {
    const code = `
        .text
            jg exit
            exit:
            syscall
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.jg, new Byte(0x00), new Byte(0x04), new Byte(0x00),
        Instruction.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
    ]);
});

test('supports jump if greater or equal', () => {
    const code = `
        .text
            jge exit
            exit:
            syscall
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.jge, new Byte(0x00), new Byte(0x04), new Byte(0x00),
        Instruction.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
    ]);
});

test('supports jump if less', () => {
    const code = `
        .text
            jl exit
            exit:
            syscall
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.jl, new Byte(0x00), new Byte(0x04), new Byte(0x00),
        Instruction.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
    ]);
});

test('supports jump if less or equal', () => {
    const code = `
        .text
            jle exit
            exit:
            syscall
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.jle, new Byte(0x00), new Byte(0x04), new Byte(0x00),
        Instruction.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
    ]);
});

test('fails if invalid operands to push instruction', () => {
    const code = `
        .text
            push invalid
    `;

    expect(() => assembler.assemble(code)).toThrow(new Error('Invalid operands to push instruction'));
});

test('supports push immediate', () => {
    const value = random(Word);
    const code = `
        .text
            push ${value}
    `;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.pushi, ...value.expand(), new Byte(0x00)]);
});

test('supports push register', () => {
    const code = `
        .text
            push eax
    `;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.push, Register.eax, new Byte(0x00), new Byte(0x00)]);
});

test('supports push memory byte', () => {
    const value = random(Byte);
    const code = `
        .data
            value db ${value}
        .text
            push value
    `;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.pushmb, new Byte(0x00), new Byte(0x04), new Byte(0x00),
        value,
    ]);
});

test('supports push memory word', () => {
    const value = random(Word);
    const code = `
        .data
            value dw ${value}
        .text
            push value
    `;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.pushmw, new Byte(0x00), new Byte(0x04), new Byte(0x00),
        ...value.expand(),
    ]);
});

test('supports push memory double', () => {
    const value = random(Double);
    const code = `
        .data
            value dd ${value}
        .text
            push value
    `;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.pushmd, new Byte(0x00), new Byte(0x04), new Byte(0x00),
        ...value.expand(),
    ]);
});

test('fails if invalid operands to pop instruction', () => {
    const code = `
        .text
            pop invalid
    `;

    expect(() => assembler.assemble(code)).toThrow(new Error('Invalid operands to pop instruction'));
});

test('supports pop', () => {
    const code = `
        .text
            pop eax
    `;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.pop, Register.eax, new Byte(0x00), new Byte(0x00)]);
});

test('supports syscall', () => {
    const code = `
        .text
            syscall
    `;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00)]);
});

test('supports call with no arguments', () => {
    const code = `
        .text
            proc:
            call proc
    `;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.call, new Byte(0x00), new Byte(0x00), new Byte(0x00)]);
});

test('supports call with arguments', () => {
    const code = `
        .text
            proc:
            call proc, 5
    `;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.calla, new Byte(0x00), new Byte(0x00), new Byte(0x05)]);
});

test('fails if invalid operands to return instruction', () => {
    const code = `
        .text
            ret invalid
    `;

    expect(() => assembler.assemble(code)).toThrow(new Error('Invalid operands to return instruction'));
});

test('supports return no value', () => {
    const code = `
        .text
            ret
    `;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.ret, new Byte(0x00), new Byte(0x00), new Byte(0x00)]);
});

test('supports return immediate', () => {
    const value = random(Word);
    const code = `
        .text
            ret ${value}
    `;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.reti, ...value.expand(), new Byte(0x00)]);
});

test('supports return register', () => {
    const code = `
        .text
            ret eax
    `;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.retr, Register.eax, new Byte(0x00), new Byte(0x00)]);
});

test('supports return memory byte', () => {
    const value = random(Byte);
    const code = `
        .data
            value db ${value}
        .text
            ret value
    `;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.retmb, new Byte(0x00), new Byte(0x04), new Byte(0x00),
        value,
    ]);
});

test('supports return memory word', () => {
    const value = random(Word);
    const code = `
        .data
            value dw ${value}
        .text
            ret value
    `;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.retmw, new Byte(0x00), new Byte(0x04), new Byte(0x00),
        ...value.expand()
    ]);
});

test('supports return memory double', () => {
    const value = random(Double);
    const code = `
        .data
            value dd ${value}
        .text
            ret value
    `;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.retmd, new Byte(0x00), new Byte(0x04), new Byte(0x00),
        ...value.expand()
    ]);
});


