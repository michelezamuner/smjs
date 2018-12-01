const Assembler = require('../../../../src/Assemblers/RASM/Assembler');
const Register = require('../../../../src/Architectures/SMA/Mnemonics').register;
const Instruction = require('../../../../src/Architectures/SMA/Mnemonics').instruction;
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
    const code = `${opcode} eax, 0x1234`;

    expect(() => assembler.assemble(code)).toThrow(new Error(`Invalid opcode: ${opcode}`));
});

test('supports move register to register', () => {
    const code = 'mov eax, ebx';
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.mov, Register.eax, Register.ebx, new Byte(0x00)]);
});

test('supports move immediate to register', () => {
    const value = random(Word);
    const code = `movi al, ${value}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.movi, Register.al, ...(new Word(value)).expand()]);
});

test('supports move immediate to memory', () => {
    const value = random(Byte);
    const code = `movim 0x08, ${value}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.movim, new Byte(0x00), new Byte(0x08), new Byte(value)]);
});

test('supports move immediate to byte register pointer', () => {
    const value = random(Word);
    const code = `movipb ax, ${value}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.movipb, Register.ax, ...(new Word(value)).expand()]);
});

test('supports move immediate to word register pointer', () => {
    const value = random(Word);
    const code = `movipw ax, ${value}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.movipw, Register.ax, ...(new Word(value)).expand()]);
});

test('supports move immediate to double register pointer', () => {
    const value = random(Word);
    const code = `movipd ax, ${value}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.movipd, Register.ax, ...(new Word(value)).expand()]);
});

test('supports move immediate to memory pointer', () => {
    const value = random(Byte);
    const code = `movimp 0x0C, ${value}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.movimp, new Byte(0x00), new Byte(0x0C), new Byte(value)]);
});

test('supports move memory to register', () => {
    const addr = random(Word);
    const code = `movm al, ${addr}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.movm, Register.al, ...(new Word(addr)).expand()]);
});

test('supports move register pointer to register', () => {
    const code = 'movp eax, ax';
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.movp, Register.eax, Register.ax, new Byte(0x00)]);
});

test('supports move register to memory', () => {
    const addr = random(Word);
    const code = `movrm ${addr}, al`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.movrm, ...(new Word(addr)).expand(), Register.al]);
});

test('supports move register to register pointer', () => {
    const code = 'movrp ax, bl';
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.movrp, Register.ax, Register.bl, new Byte(0x00)]);
});

test('supports move register to memory pointer', () => {
    const addr = random(Word);
    const code = `movrmp ${addr}, ax`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.movrmp, ...(new Word(addr)).expand(), Register.ax]);
});

test('supports increment', () => {
    const code = 'inc al';
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.inc, Register.al, new Byte(0x00), new Byte(0x00)]);
});

test('supports decrement', () => {
    const code = 'dec al';
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.dec, Register.al, new Byte(0x00), new Byte(0x00)]);
});

test('supports add immediate to register', () => {
    const value = random(Word);
    const code = `addi eax, ${value}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.addi, Register.eax, ...(new Word(value)).expand()]);
});

test('supports add register to register', () => {
    const code = 'add eax, ebx';
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.add, Register.eax, Register.ebx, new Byte(0x00)]);
});

test('supports add memory to register', () => {
    const addr = random(Word);
    const code = `addm eax, ${addr}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.addm, Register.eax, ...(new Word(addr)).expand()]);
});

test('supports subtract immediate from register', () => {
    const value = random(Word);
    const code = `subi eax, ${value}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.subi, Register.eax, ...(new Word(value)).expand()]);
});

test('supports subtract register from register', () => {
    const code = 'sub eax, ebx';
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.sub, Register.eax, Register.ebx, new Byte(0x00)]);
});

test('supports subtract memory from register', () => {
    const addr = random(Word);
    const code = `subm eax, ${addr}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.subm, Register.eax, ...(new Word(addr)).expand()]);
});

test('supports multiply register by immediate', () => {
    const value = random(Byte);
    const code = `muli al, ${value}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.muli, Register.al, new Byte(0x00), new Byte(value)]);
});

test('supports multiply register by register', () => {
    const couples = [['al', 'bh'], ['eax', 'edx'], ['cx', 'ax']];

    for (const couple of couples) {
        const code = `mul ${couple[0]}, ${couple[1]}`;

        const bytes = assembler.assemble(code);

        expect(bytes).toStrictEqual([
            Instruction.mul, Register[couple[0]], Register[couple[1]], new Byte(0x00),
        ]);
    }
});

test('supports multiply register by memory', () => {
    const addr = random(Word);
    const code = `mulm al, ${addr}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.mulm, Register.al, ...(new Word(addr)).expand()]);
});

test('supports compare to immediate', () => {
    const value = random(Word);
    const code = `cmpi ecx, ${value}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.cmpi, Register.ecx, ...(new Word(value)).expand()]);
});

test('supports compare to register', () => {
    const code = 'cmp ecx, eax';
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.cmp, Register.ecx, Register.eax, new Byte(0x00)]);
});

test('supports compare to memory', () => {
    const addr = random(Word);
    const code = `cmpm ecx, ${addr}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.cmpm, Register.ecx, ...(new Word(addr)).expand()]);
});

test('supports unconditional jump', () => {
    const addr = random(Word);
    const code = `jmp ${addr}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.jmp, ...(new Word(addr)).expand(), new Byte(0x00)]);
});

test('supports jump if equal', () => {
    const addr = random(Word);
    const code = `je ${addr}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.je, ...(new Word(addr)).expand(), new Byte(0x00)]);
});

test('supports jump if not equal', () => {
    const addr = random(Word);
    const code = `jne ${addr}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.jne, ...(new Word(addr)).expand(), new Byte(0x00)]);
});

test('supports jump if greater', () => {
    const addr = random(Word);
    const code = `jg ${addr}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.jg, ...(new Word(addr)).expand(), new Byte(0x00)]);
});

test('supports jump if greater or equal', () => {
    const addr = random(Word);
    const code = `jge ${addr}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.jge, ...(new Word(addr)).expand(), new Byte(0x00)]);
});

test('supports jump if less', () => {
    const addr = random(Word);
    const code = `jl ${addr}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.jl, ...(new Word(addr)).expand(), new Byte(0x00)]);
});

test('supports jump if less or equal', () => {
    const addr = random(Word);
    const code = `jle ${addr}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.jle, ...(new Word(addr)).expand(), new Byte(0x00)]);
});

test('supports push immediate', () => {
    const value = random(Word);
    const code = `pushi ${value}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.pushi, ...(new Word(value)).expand(), new Byte(0x00)]);
});

test('supports push register', () => {
    const code = 'push eax';
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.push, Register.eax, new Byte(0x00), new Byte(0x00)]);
});

test('supports push memory byte', () => {
    const mem = random(Word);
    const code = `pushmb ${mem}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.pushmb, ...(new Word(mem)).expand(), new Byte(0x00)]);
});

test('supports push memory word', () => {
    const mem = random(Word);
    const code = `pushmw ${mem}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.pushmw, ...(new Word(mem)).expand(), new Byte(0x00)]);
});

test('supports push memory double', () => {
    const mem = random(Word);
    const code = `pushmd ${mem}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.pushmd, ...(new Word(mem)).expand(), new Byte(0x00)]);
});

test('supports pop to register', () => {
    const code = 'pop eax';
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.pop, Register.eax, new Byte(0x00), new Byte(0x00)]);
});

test('supports syscall', () => {
    const code = 'syscall';
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00)]);
});

test('supports call with no arguments', () => {
    const procedure = random(Word);
    const code = `call ${procedure}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.call, ...(new Word(procedure)).expand(), new Byte(0x00)]);
});

test('supports call with arguments', () => {
    const procedure = random(Word);
    const argsSize = random(Byte);
    const code = `calla ${procedure}, ${argsSize}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.calla, ...(new Word(procedure)).expand(), new Byte(argsSize)]);
});

test('supports return no value', () => {
    const code = 'ret';
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.ret, new Byte(0x00), new Byte(0x00), new Byte(0x00)]);
});

test('supports return immediate', () => {
    const value = random(Word);
    const code = `reti ${value}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.reti, ...(new Word(value)).expand(), new Byte(0x00)]);
});

test('supports return register', () => {
    const code = 'retr eax';
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.retr, Register.eax, new Byte(0x00), new Byte(0x00)]);
});

test('supports return memory byte', () => {
    const mem = random(Word);
    const code = `retmb ${mem}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.retmb, ...(new Word(mem)).expand(), new Byte(0x00)]);
});

test('supports return memory word', () => {
    const mem = random(Word);
    const code = `retmw ${mem}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.retmw, ...(new Word(mem)).expand(), new Byte(0x00)]);
});

test('supports return memory double', () => {
    const mem = random(Word);
    const code = `retmd ${mem}`;
    const bytes = assembler.assemble(code);

    expect(bytes).toStrictEqual([Instruction.retmd, ...(new Word(mem)).expand(), new Byte(0x00)]);
});
