const Assembler = require('../../../../src/Assemblers/RASM/Assembler');
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
        movm     ax,    0x04
          0x02    0x04
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.movm, Register.ax, new Byte(0x00), new Byte(0x04),
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
        Instruction.movi, Register.al, new Byte(0x00), new Byte(0x01),
        Instruction.mov, Register.bl, Register.al, new Byte(0x00),
        Instruction.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
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
        Instruction.movi, Register.al, new Byte(0x00), new Byte(0x01),
        Instruction.mov, Register.bl, Register.al, new Byte(0x00),
        Instruction.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
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
        Instruction.movi, Register.al, new Byte(0x00), new Byte(0x01),
        Instruction.mov, Register.bl, Register.al, new Byte(0x00),
        Instruction.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
    ]);
});

test('fails if invalid mnemonic is used', () => {
    const opcode = 'invalid';
    const code = `
        ${opcode} eax, 0x1234
    `;

    expect(() => assembler.assemble(code)).toThrow(new Error(`Invalid opcode: ${opcode}`));
});

test('supports move register to register', () => {
    const code = `
        mov eax, ebx
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.mov, Register.eax, Register.ebx, new Byte(0x00)]);
});

test('supports move immediate to register', () => {
    const value = random(Word);
    const code = `
        movi al, ${value}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.movi, Register.al, ...(new Word(value)).expand()]);
});

test('supports move immediate to byte memory', () => {
    const value = random(Byte);
    const code = `
        movim 0x08, ${value}
        movm al, 0x08
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.movim, new Byte(0x00), new Byte(0x08), new Byte(value),
        Instruction.movm, Register.al, new Byte(0x00), new Byte(0x08),
    ]);
});

test('supports move immediate to byte register pointer', () => {
    const value = random(Word);
    const code = `
        movi ax, 0x08
        movipb ax, ${value}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.movi, Register.ax, new Byte(0x00), new Byte(0x08),
        Instruction.movipb, Register.ax, ...(new Word(value)).expand(),
    ]);
});

test('supports move immediate to word register pointer', () => {
    const value = random(Word);
    const code = `
        movi ax, 0x08
        movipw ax, ${value}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.movi, Register.ax, new Byte(0x00), new Byte(0x08),
        Instruction.movipw, Register.ax, ...(new Word(value)).expand(),
    ]);
});

test('supports move immediate to double register pointer', () => {
    const value = random(Word);
    const code = `
        movi ax, 0x08
        movipd ax, ${value}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.movi, Register.ax, new Byte(0x00), new Byte(0x08),
        Instruction.movipd, Register.ax, ...(new Word(value)).expand(),
    ]);
});

test('supports move immediate to memory pointer', () => {
    const value = random(Byte);
    const code = `
        movi ax, 0x0E
        movrm 0x0C, ax
        movimp 0x0C, ${value}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.movi, Register.ax, new Byte(0x00), new Byte(0x0E),
        Instruction.movrm, new Byte(0x00), new Byte(0x0C), Register.ax,
        Instruction.movimp, new Byte(0x00), new Byte(0x0C), new Byte(value),
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
        Instruction.movm, Register.al, new Byte(0x00), new Byte(0x08),
        Instruction.movm, Register.bx, new Byte(0x00), new Byte(0x09),
        new Byte(value), new Byte(wordLeft), new Byte(wordRight),
    ]);
});

test('supports move register pointer to register', () => {
    const value = new Double(random(Double));
    const valueb = value.expand();
    const code = `
        movi ax, 0x08
        movp eax, ax
        ${valueb.map(byte => byte.toString()).join(' ')}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.movi, Register.ax, ...(new Word(0x08)).expand(),
        Instruction.movp, Register.eax, Register.ax, new Byte(0x00),
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
        Instruction.movm, Register.al, new Byte(0x00), new Byte(0x0C),
        Instruction.movrm, new Byte(0x00), new Byte(0x0D), Register.al,
        Instruction.movm, Register.bl, new Byte(0x00), new Byte(0x0D),
        new Byte(value)
    ]);
});

test('supports move register to register pointer', () => {
    const value = random(Byte);
    const code = `
        movi ax, 0x0C
        movi bl, ${value}
        movrp ax, bl
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.movi, Register.ax, ...(new Word(0x0C)).expand(),
        Instruction.movi, Register.bl, ...(new Word(value)).expand(),
        Instruction.movrp, Register.ax, Register.bl, new Byte(0x00),
    ]);
});

test('supports move register to memory pointer', () => {
    const value = random(Word);
    const code = `
        movi ax, ${value}
        movrmp 0x08, ax
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.movi, Register.ax, ...(new Word(value)).expand(),
        Instruction.movrmp, ...(new Word(0x08)).expand(), Register.ax,
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
        Instruction.movi, Register.al, new Byte(0x00), new Byte(0x01),
        Instruction.movm, Register.bl, new Byte(0x00), new Byte(0x0C),
        Instruction.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00),
        new Byte(value),
    ]);
});

test('supports multiply register by immediate', () => {
    const value = random(Byte);
    const code = `
        muli al, ${value}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.muli, Register.al, new Byte(0x00), new Byte(value),
    ]);
});

test('supports multiply register by register', () => {
    const couples = [['al', 'bh'], ['eax', 'edx'], ['cx', 'ax']];

    for (const couple of couples) {
        const code = `
            mul ${couple[0]}, ${couple[1]}
        `;

        const bytes = assembler.assemble(code);

        expect(bytes).toStrictEqual([
            Instruction.mul, Register[couple[0]], Register[couple[1]], new Byte(0x00),
        ]);
    }
});

test('supports multiply register by memory', () => {
    const addr = random(Word);
    const code = `
        mulm al, ${addr}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.mulm, Register.al, ...(new Word(addr)).expand(),
    ]);
});

test('supports compare to immediate', () => {
    const value = random(Word);
    const code = `
        cmpi ecx, ${value}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.cmpi, Register.ecx, ...(new Word(value)).expand(),
    ]);
});

test('supports compare to register', () => {
    const code = `
        cmp ecx, eax
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.cmp, Register.ecx, Register.eax, new Byte(0x00),
    ]);
});

test('supports compare to memory', () => {
    const addr = random(Word);
    const code = `
        cmpm ecx, ${addr}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.cmpm, Register.ecx, ...(new Word(addr)).expand(),
    ]);
});

test('supports unconditional jump', () => {
    const addr = random(Word);
    const code = `
        jmp ${addr}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.jmp, ...(new Word(addr)).expand(), new Byte(0x00),
    ]);
});

test('supports jump if equal', () => {
    const addr = random(Word);
    const code = `
        je ${addr}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.je, ...(new Word(addr)).expand(), new Byte(0x00),
    ]);
});

test('supports jump if not equal', () => {
    const addr = random(Word);
    const code = `
        jne ${addr}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.jne, ...(new Word(addr)).expand(), new Byte(0x00),
    ]);
});

test('supports jump if greater', () => {
    const addr = random(Word);
    const code = `
        jg ${addr}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.jg, ...(new Word(addr)).expand(), new Byte(0x00),
    ]);
});

test('supports jump if greater or equal', () => {
    const addr = random(Word);
    const code = `
        jge ${addr}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.jge, ...(new Word(addr)).expand(), new Byte(0x00),
    ]);
});

test('supports jump if less', () => {
    const addr = random(Word);
    const code = `
        jl ${addr}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.jl, ...(new Word(addr)).expand(), new Byte(0x00),
    ]);
});

test('supports jump if less or equal', () => {
    const addr = random(Word);
    const code = `
        jle ${addr}
    `;

    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([
        Instruction.jle, ...(new Word(addr)).expand(), new Byte(0x00),
    ]);
});
