const InterpreterInterface = require('../../../../src/ProcessorInterfaces/Interpreter');
const Exit = require('../../../../src/ProcessorInterfaces/Exit');
const Interpreter = require('../../../../src/Architectures/SMA/Interpreter');
const RegisterAddress = require('../../../../src/Architectures/SMA/RegisterAddress');
const Register = require('../../../../src/Architectures/SMA/Mnemonics').register;
const Instruction = require('../../../../src/Architectures/SMA/Mnemonics').instruction;
const Byte = require('../../../../src/DataTypes/Byte');
const Word = require('../../../../src/DataTypes/Word');
const Double = require('../../../../src/DataTypes/Double');
const random = require('../../random');

/**
 * @type {Object}
 */
const registers = {};

/**
 * @type {Object}
 */
const memory = {};

/**
 * @type {Object}
 */
const system = {};

/**
 * @type {null|Interpreter}
 */
let interpreter = null;

beforeEach(() => {
    registers.set = jest.fn();
    registers.setExit = jest.fn();
    registers.setEs = jest.fn();
    registers.get = jest.fn();
    memory.write = jest.fn();
    interpreter = new Interpreter(registers, memory, system);
});

test('implements interpreter interface', () => {
    expect(interpreter instanceof InterpreterInterface).toBe(true);
});

test('provides instructions size', () => {
    expect(interpreter.getInstructionSize()).toStrictEqual(new Byte(4));
});

test('implements move register to register', () => {
    const value = random(Double);
    const instruction = [Instruction.mov, Register.eax, Register.ebx, new Byte(0x00)];

    registers.get = jest.fn(() => new Double(value));

    interpreter.exec(instruction);

    expect(registers.get.mock.calls[0][0]).toStrictEqual(new RegisterAddress(Register.ebx));
    expect(registers.set.mock.calls[0][0]).toStrictEqual(new RegisterAddress(Register.eax));
    expect(registers.set.mock.calls[0][1]).toStrictEqual(new Double(value));
});

test('fails if size mismatch on move register to register', () => {
    const combinations = [
        ['al', 'bx'], ['al', 'ebx'], ['ah', 'bx'], ['ah', 'ebx'],
        ['ax', 'bl'], ['ax', 'bh'], ['ax', 'ebx'], ['eax', 'bl'],
        ['eax', 'bh'], ['eax', 'bx']
    ];
    for (const [first, second] of combinations) {
        const instruction = [Instruction.mov, Register[first], Register[second], new Byte(0x00)];
        const source = new RegisterAddress(Register[second]).format();
        const target = new RegisterAddress(Register[first]).format();

        expect(() => interpreter.exec(instruction)).toThrow(`Cannot move register ${source} to register ${target}`);
    }
});

test('implements move immediate to register', () => {
    const value = new Word(random(Word));
    const bytes = value.expand();

    let instruction = [Instruction.movi, Register.al, ...bytes];
    interpreter.exec(instruction);

    expect(registers.set.mock.calls[0][0]).toStrictEqual(new RegisterAddress(Register.al));
    expect(registers.set.mock.calls[0][1]).toStrictEqual(bytes[1]);

    instruction = [Instruction.movi, Register.ax, ...bytes];
    interpreter.exec(instruction);

    expect(registers.set.mock.calls[1][0]).toStrictEqual(new RegisterAddress(Register.ax));
    expect(registers.set.mock.calls[1][1]).toStrictEqual(value);

    instruction = [Instruction.movi, Register.eax, ...bytes];
    interpreter.exec(instruction);

    expect(registers.set.mock.calls[2][0]).toStrictEqual(new RegisterAddress(Register.eax));
    expect(registers.set.mock.calls[2][1]).toStrictEqual(new Double(new Byte(0x00), new Byte(0x00), ...bytes));
});

test('implements move immediate to memory', () => {
    const value = new Byte(random(Byte));
    const mem = new Word(random(Word));
    const instruction = [Instruction.movim, ...mem.expand(), value];

    interpreter.exec(instruction);

    expect(memory.write.mock.calls[0][0]).toStrictEqual(mem);
    expect(memory.write.mock.calls[0][1]).toStrictEqual(value);
});

test('implements move immediate to byte register pointer', () => {
    const value = new Word(random(Word));
    const bytes = value.expand();
    const address = new Word(random(Word));
    const instruction = [Instruction.movipb, Register.ax, ...bytes];

    registers.get = reg => reg.eq(new RegisterAddress(Register.ax)) ? address : new Word(0x00);

    interpreter.exec(instruction);

    expect(memory.write.mock.calls[0][0]).toStrictEqual(address);
    expect(memory.write.mock.calls[0][1]).toStrictEqual(bytes[1]);
});

test('implements move immediate to word register pointer', () => {
    const value = new Word(random(Word));
    const bytes = value.expand();
    const address = new Word(random(Word));
    const instruction = [Instruction.movipw, Register.ax, ...bytes];

    registers.get = reg => reg.eq(new RegisterAddress(Register.ax)) ? address : new Word(0x00);

    interpreter.exec(instruction);

    expect(memory.write.mock.calls[0][0]).toStrictEqual(address);
    expect(memory.write.mock.calls[0][1]).toStrictEqual(bytes[0]);
    expect(memory.write.mock.calls[1][0]).toStrictEqual(address.add(new Byte(0x01)));
    expect(memory.write.mock.calls[1][1]).toStrictEqual(bytes[1]);

});

test('implements move immediate to double register pointer', () => {
    const value = new Word(random(Word));
    const bytes = value.expand();
    const address = new Word(random(Word));
    const instruction = [Instruction.movipd, Register.ax, ...bytes];

    registers.get = reg => reg.eq(new RegisterAddress(Register.ax)) ? address : new Word(0x00);

    interpreter.exec(instruction);

    expect(memory.write.mock.calls[0][0]).toStrictEqual(address);
    expect(memory.write.mock.calls[0][1]).toStrictEqual(new Byte(0x00));
    expect(memory.write.mock.calls[1][0]).toStrictEqual(address.add(new Byte(0x01)));
    expect(memory.write.mock.calls[1][1]).toStrictEqual(new Byte(0x00));
    expect(memory.write.mock.calls[2][0]).toStrictEqual(address.add(new Byte(0x02)));
    expect(memory.write.mock.calls[2][1]).toStrictEqual(bytes[0]);
    expect(memory.write.mock.calls[3][0]).toStrictEqual(address.add(new Byte(0x03)));
    expect(memory.write.mock.calls[3][1]).toStrictEqual(bytes[1]);
});

test('fails if size mismatch on move immediate to register pointer', () => {
    const forbidden = ['ah', 'al', 'eax', 'bh', 'bl', 'ebx', 'ch', 'cl', 'ecx', 'dh', 'dl', 'edx'];
    for (const register of forbidden) {
        const value = new Word(random(Word));
        let instruction = [Instruction.movipb, Register[register], ...value.expand()];
        expect(() => interpreter.exec(instruction))
            .toThrow(`Cannot use register ${new RegisterAddress(Register[register]).format()} as pointer`);

        instruction = [Instruction.movipw, Register[register], ...value.expand()];
        expect(() => interpreter.exec(instruction))
            .toThrow(`Cannot use register ${new RegisterAddress(Register[register]).format()} as pointer`);

        instruction = [Instruction.movipd, Register[register], ...value.expand()];
        expect(() => interpreter.exec(instruction))
            .toThrow(`Cannot use register ${new RegisterAddress(Register[register]).format()} as pointer`);
    }
});

test('implements move immediate to memory pointer', () => {
    const value = new Byte(random(Byte));
    const ptr = new Word(random(Word));
    const mem = new Word(random(Word));
    const instruction = [Instruction.movimp, ...ptr.expand(), value];

    memory.readSet = (addr, size) => addr.eq(ptr) && size.eq(new Byte(0x02)) ? mem.expand() : new Word(0x00);

    interpreter.exec(instruction);

    expect(memory.write.mock.calls[0][0]).toStrictEqual(mem);
    expect(memory.write.mock.calls[0][1]).toStrictEqual(value);
});

test('implements move memory to register', () => {
    for (const register of [Register.ah, Register.ax, Register.eax]) {
        registers.set = jest.fn();
        const mem = new Word(random(Word));
        const type = new RegisterAddress(register).getType();
        const value = new type(random(type));
        const instruction = [Instruction.movm, register, ...mem.expand()];

        memory.readSet = (addr, size) => addr.eq(mem) && size.eq(new Byte(type.SIZE)) ? value.expand() : [];

        interpreter.exec(instruction);

        expect(registers.set.mock.calls[0][0]).toStrictEqual(new RegisterAddress(register));
        expect(registers.set.mock.calls[0][1]).toStrictEqual(value);
    }
});

test('implements move register pointer to register', () => {
    for (const reg of [Register.al, Register.ax, Register.eax]) {
        registers.set = jest.fn();
        const type = new RegisterAddress(reg).getType();
        const value = new type(random(type));
        const mem = new Word(random(Word));
        const instruction = [Instruction.movp, reg, Register.bx, new Byte(0x00)];

        registers.get = reg => reg.eq(new RegisterAddress(Register.bx)) ? mem : new Word(0x00);
        memory.readSet = (addr, size) => addr.eq(mem) && size.eq(new Byte(type.SIZE)) ? value.expand() : [];

        interpreter.exec(instruction);

        expect(registers.set.mock.calls[0][0]).toStrictEqual(new RegisterAddress(reg));
        expect(registers.set.mock.calls[0][1]).toStrictEqual(value);
    }
});

test('fails if size mismatch on move register pointer to register', () => {
    const forbidden = [
        Register.ah, Register.al, Register.eax,
        Register.bh, Register.bl, Register.ebx,
        Register.ch, Register.cl, Register.ecx,
        Register.dh, Register.dl, Register.edx,
    ];
    for (const register of forbidden) {
        const instruction = [Instruction.movp, Register.eax, register, new Byte(0x00)];
        expect(() => interpreter.exec(instruction))
            .toThrow(`Cannot use register ${new RegisterAddress(register).format()} as pointer`);
    }
});

test('implements move register to memory', () => {
    for (const register of [Register.ah, Register.ax, Register.eax]) {
        memory.write = jest.fn();
        const mem = new Word(random(Word));
        const type = new RegisterAddress(register).getType();
        const value = new type(random(type));
        const valueb = value.expand();
        const instruction = [Instruction.movrm, ...mem.expand(), register];

        registers.get = reg => reg.eq(new RegisterAddress(register)) ? value : new type(0x00);

        interpreter.exec(instruction);

        for (let i = 0; i < type.SIZE; i++) {
            expect(memory.write.mock.calls[i][0]).toStrictEqual(mem.add(new Byte(i)));
            expect(memory.write.mock.calls[i][1]).toStrictEqual(valueb[i]);
        }
    }
});

test('implements move register to register pointer', () => {
    for (const register of [Register.ah, Register.ax, Register.eax]) {
        memory.write = jest.fn();
        const mem = new Word(random(Word));
        const type = new RegisterAddress(register).getType();
        const value = new type(random(type));
        const valueb = value.expand();
        const instruction = [Instruction.movrp, Register.bx, register, new Byte(0x00)];

        registers.get = reg => {
            if (reg.eq(new RegisterAddress(register))) {
                return value;
            } else if (reg.eq(new RegisterAddress(Register.bx))) {
                return mem;
            }
            return new Byte(0x00);
        };

        interpreter.exec(instruction);

        for (let i = 0; i < type.SIZE; i++) {
            expect(memory.write.mock.calls[i][0]).toStrictEqual(mem.add(new Byte(i)));
            expect(memory.write.mock.calls[i][1]).toStrictEqual(valueb[i]);
        }
    }
});

test('fails if type mismatch on move register to register pointer', () => {
    const forbidden = [
        Register.ah, Register.al, Register.eax,
        Register.bh, Register.bl, Register.ebx,
        Register.ch, Register.cl, Register.ecx,
        Register.dh, Register.dl, Register.edx,
    ];
    for (const register of forbidden) {
        const instruction = [Instruction.movrp, register, Register.ah, new Byte(0x00)];
        expect(() => interpreter.exec(instruction))
            .toThrow(`Cannot use register ${new RegisterAddress(register).format()} as pointer`)
    }
});

test('implements move register to memory pointer', () => {
    for (const register of [Register.ah, Register.ax, Register.eax]) {
        memory.write = jest.fn();
        const ptr = new Word(random(Word));
        const mem = new Word(random(Word));
        const type = new RegisterAddress(register).getType();
        const value = new type(random(type));
        const valueb = value.expand();
        const instruction = [Instruction.movrmp, ...ptr.expand(), register];

        registers.get = reg => reg.eq(new RegisterAddress(register)) ? value : new type(0x00);
        memory.readSet = (addr, size) => addr.eq(ptr) && size.eq(new Byte(0x02)) ? mem.expand() : [];

        interpreter.exec(instruction);

        for (let i = 0; i < type.SIZE; i++) {
            expect(memory.write.mock.calls[i][0]).toStrictEqual(mem.add(new Byte(i)));
            expect(memory.write.mock.calls[i][1]).toStrictEqual(valueb[i]);
        }
    }
});

test('implements syscall exit', () => {
    let instruction = [Instruction.mov, Register.al, Register.bl, new Byte(0x00)];
    let exit = interpreter.exec(instruction);

    expect(exit).toBeInstanceOf(Exit);
    expect(exit.shouldExit()).toBe(false);

    const value = new Double(new Byte(0x00), new Byte(0x00), new Byte(random(Byte)), new Byte(random(Byte)));
    instruction = [Instruction.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00)];

    registers.get = jest.fn(reg => reg.eq(new RegisterAddress(Register.eax)) ? Interpreter.SYS_EXIT : value);

    exit = interpreter.exec(instruction);

    expect(registers.get).nthCalledWith(1, new RegisterAddress(Register.eax));
    expect(registers.get).nthCalledWith(2, new RegisterAddress(Register.ebx));
    expect(exit).toBeInstanceOf(Exit);
    expect(exit.shouldExit()).toBe(true);
    expect(exit.getExitStatus()).toStrictEqual(value.expand()[3]);
});

test('implement syscall write', () => {
    const fd = new Byte(random(Byte));
    const buf = new Word(random(Word));
    const count = new Word(random(Word));
    const bytes = new Double(random(Double)).expand();
    const written = random(Byte);
    const instruction = [Instruction.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00)];

    registers.get = reg => {
        if (reg.eq(new RegisterAddress(Register.eax))) {
            return Interpreter.SYS_WRITE;
        } else if (reg.eq(new RegisterAddress(Register.ebx))) {
            return fd;
        } else if (reg.eq(new RegisterAddress(Register.ecx))) {
            return buf;
        } else if (reg.eq(new RegisterAddress(Register.edx))) {
            return count;
        }
    };

    memory.readSet = (addr, size) => addr.eq(buf) && size.eq(count) ? bytes : [];
    system.write = (fdParam, bufParam, countParam) => {
        const expectedBuf = new Double(...bytes);
        const actualBuf = new Double(...bufParam.map(value => new Byte(value)));
        if (fdParam === fd.uint() && actualBuf.eq(expectedBuf) && countParam === count.uint()) {
            return written;
        }
        return 0;
    };

    interpreter.exec(instruction);

    expect(registers.set.mock.calls[0][0]).toStrictEqual(new RegisterAddress(Register.eax));
    expect(registers.set.mock.calls[0][1]).toStrictEqual(new Double(written));
});
