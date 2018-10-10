const InterpreterInterface = require('../../../../src/ProcessorInterfaces/Interpreter');
const Exit = require('../../../../src/ProcessorInterfaces/Exit');
const Interpreter = require('../../../../src/Architectures/SMA/Interpreter');
const RegisterAddress = require('../../../../src/Architectures/SMA/RegisterAddress');
const Mnemonics = require('../../../../src/Architectures/SMA/Mnemonics');
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
    const instruction = [Mnemonics.mov, Mnemonics.eax, Mnemonics.ebx, new Byte(0x00)];

    registers.get = jest.fn(() => new Double(value));

    interpreter.exec(instruction);

    expect(registers.get.mock.calls[0][0]).toStrictEqual(new RegisterAddress(Mnemonics.ebx));
    expect(registers.set.mock.calls[0][0]).toStrictEqual(new RegisterAddress(Mnemonics.eax));
    expect(registers.set.mock.calls[0][1]).toStrictEqual(new Double(value));
});

test('fails if size mismatch on move register to register', () => {
    const combinations = [
        ['al', 'bx'], ['al', 'ebx'], ['ah', 'bx'], ['ah', 'ebx'],
        ['ax', 'bl'], ['ax', 'bh'], ['ax', 'ebx'], ['eax', 'bl'],
        ['eax', 'bh'], ['eax', 'bx']
    ];
    for (const [first, second] of combinations) {
        const instruction = [Mnemonics.mov, Mnemonics[first], Mnemonics[second], new Byte(0x00)];
        const source = new RegisterAddress(Mnemonics[second]).format();
        const target = new RegisterAddress(Mnemonics[first]).format();

        expect(() => interpreter.exec(instruction)).toThrow(`Cannot move register ${source} to register ${target}`);
    }
});

test('implements move immediate to register', () => {
    const value = new Word(random(Word));
    const bytes = value.expand();

    let instruction = [Mnemonics.movi, Mnemonics.al, ...bytes];
    interpreter.exec(instruction);

    expect(registers.set.mock.calls[0][0]).toStrictEqual(new RegisterAddress(Mnemonics.al));
    expect(registers.set.mock.calls[0][1]).toStrictEqual(bytes[1]);

    instruction = [Mnemonics.movi, Mnemonics.ax, ...bytes];
    interpreter.exec(instruction);

    expect(registers.set.mock.calls[1][0]).toStrictEqual(new RegisterAddress(Mnemonics.ax));
    expect(registers.set.mock.calls[1][1]).toStrictEqual(value);

    instruction = [Mnemonics.movi, Mnemonics.eax, ...bytes];
    interpreter.exec(instruction);

    expect(registers.set.mock.calls[2][0]).toStrictEqual(new RegisterAddress(Mnemonics.eax));
    expect(registers.set.mock.calls[2][1]).toStrictEqual(new Double(new Byte(0x00), new Byte(0x00), ...bytes));
});

test('implements move immediate to memory', () => {
    const value = new Byte(random(Byte));
    const mem = new Word(random(Word));
    const instruction = [Mnemonics.movim, ...mem.expand(), value];

    interpreter.exec(instruction);

    expect(memory.write.mock.calls[0][0]).toStrictEqual(mem);
    expect(memory.write.mock.calls[0][1]).toStrictEqual(value);
});

test('implements move immediate byte to register pointer', () => {
    const value = new Byte(random(Byte));
    const address = new Word(random(Word));
    const instruction = [Mnemonics.movipb, Mnemonics.ax, value, new Byte(0x00)];

    registers.get = reg => reg.eq(new RegisterAddress(Mnemonics.ax)) ? address : new Word(0x00);

    interpreter.exec(instruction);

    expect(memory.write.mock.calls[0][0]).toStrictEqual(address);
    expect(memory.write.mock.calls[0][1]).toStrictEqual(value);
});

test('implements move immediate word to register pointer', () => {
    const value = new Word(random(Word));
    const bytes = value.expand();
    const address = new Word(random(Word));
    const instruction = [Mnemonics.movipw, Mnemonics.ax, ...bytes];

    registers.get = reg => reg.eq(new RegisterAddress(Mnemonics.ax)) ? address : new Word(0x00);

    interpreter.exec(instruction);

    expect(memory.write.mock.calls[0][0]).toStrictEqual(address);
    expect(memory.write.mock.calls[0][1]).toStrictEqual(bytes[0]);
    expect(memory.write.mock.calls[1][0]).toStrictEqual(address.add(new Byte(0x01)));
    expect(memory.write.mock.calls[1][1]).toStrictEqual(bytes[1]);

});

test('fails if size mismatch on move immediate to register pointer', () => {
    const forbidden = ['ah', 'al', 'eax', 'bh', 'bl', 'ebx', 'ch', 'cl', 'ecx', 'dh', 'dl', 'edx'];
    for (const register of forbidden) {
        let value = new Byte(random(Byte));
        let instruction = [Mnemonics.movipb, Mnemonics[register], value, new Byte(0x00)];
        expect(() => interpreter.exec(instruction))
            .toThrow(`Cannot use register ${new RegisterAddress(Mnemonics[register]).format()} as pointer`);

        value = new Word(random(Word));
        instruction = [Mnemonics.movipw, Mnemonics[register], ...value.expand()];
        expect(() => interpreter.exec(instruction))
            .toThrow(`Cannot use register ${new RegisterAddress(Mnemonics[register]).format()} as pointer`);
    }
});

test('implements move immediate to memory pointer', () => {
    const value = new Byte(random(Byte));
    const ptr = new Word(random(Word));
    const mem = new Word(random(Word));
    const instruction = [Mnemonics.movimp, ...ptr.expand(), value];

    memory.readSet = (addr, size) => addr.eq(ptr) && size.eq(new Byte(0x02)) ? mem.expand() : new Word(0x00);

    interpreter.exec(instruction);

    expect(memory.write.mock.calls[0][0]).toStrictEqual(mem);
    expect(memory.write.mock.calls[0][1]).toStrictEqual(value);
});

test('implements move memory to register', () => {
    for (const register of [Mnemonics.ah, Mnemonics.ax, Mnemonics.eax]) {
        registers.set = jest.fn();
        const mem = new Word(random(Word));
        const type = new RegisterAddress(register).getType();
        const value = new type(random(type));
        const instruction = [Mnemonics.movm, register, ...mem.expand()];

        memory.readSet = (addr, size) => addr.eq(mem) && size.eq(new Byte(type.SIZE)) ? value.expand() : [];

        interpreter.exec(instruction);

        expect(registers.set.mock.calls[0][0]).toStrictEqual(new RegisterAddress(register));
        expect(registers.set.mock.calls[0][1]).toStrictEqual(value);
    }
});

test('implements move register pointer to register', () => {
    for (const reg of [Mnemonics.al, Mnemonics.ax, Mnemonics.eax]) {
        registers.set = jest.fn();
        const type = new RegisterAddress(reg).getType();
        const value = new type(random(type));
        const mem = new Word(random(Word));
        const instruction = [Mnemonics.movp, reg, Mnemonics.bx, new Byte(0x00)];

        registers.get = reg => reg.eq(new RegisterAddress(Mnemonics.bx)) ? mem : new Word(0x00);
        memory.readSet = (addr, size) => addr.eq(mem) && size.eq(new Byte(type.SIZE)) ? value.expand() : [];

        interpreter.exec(instruction);

        expect(registers.set.mock.calls[0][0]).toStrictEqual(new RegisterAddress(reg));
        expect(registers.set.mock.calls[0][1]).toStrictEqual(value);
    }
});

test('fails if size mismatch on move register pointer to register', () => {
    const forbidden = [
        Mnemonics.ah, Mnemonics.al, Mnemonics.eax,
        Mnemonics.bh, Mnemonics.bl, Mnemonics.ebx,
        Mnemonics.ch, Mnemonics.cl, Mnemonics.ecx,
        Mnemonics.dh, Mnemonics.dl, Mnemonics.edx,
    ];
    for (const register of forbidden) {
        const instruction = [Mnemonics.movp, Mnemonics.eax, register, new Byte(0x00)];
        expect(() => interpreter.exec(instruction))
            .toThrow(`Cannot use register ${new RegisterAddress(register).format()} as pointer`);
    }
});

test('implements move memory pointer to register', () => {
    for (const reg in [Mnemonics.al, Mnemonics.ax, Mnemonics.eax]) {
        registers.set = jest.fn();
        const type = new RegisterAddress(reg).getType();
        const ptr = new Word(random(Word));
        const mem = new Word(random(Word));
        const value = new type(random(type));
        const instruction = [Mnemonics.movmp, reg, ...ptr.expand()];

        memory.readSet = (addr, size) => {
            if (addr.eq(ptr) && size.eq(new Byte(0x02))) {
                return mem.expand();
            }
            if (addr.eq(mem) && size.eq(new Byte(type.SIZE))) {
                return value.expand();
            }
            return [];
        };

        interpreter.exec(instruction);

        expect(registers.set.mock.calls[0][0]).toStrictEqual(new RegisterAddress(reg));
        expect(registers.set.mock.calls[0][1]).toStrictEqual(value);
    }
});

test('implements move register to memory', () => {
    for (const register of [Mnemonics.ah, Mnemonics.ax, Mnemonics.eax]) {
        memory.write = jest.fn();
        const mem = new Word(random(Word));
        const type = new RegisterAddress(register).getType();
        const value = new type(random(type));
        const valueb = value.expand();
        const instruction = [Mnemonics.movrm, ...mem.expand(), register];

        registers.get = reg => reg.eq(new RegisterAddress(register)) ? value : new type(0x00);

        interpreter.exec(instruction);

        for (let i = 0; i < type.SIZE; i++) {
            expect(memory.write.mock.calls[i][0]).toStrictEqual(mem.add(new Byte(i)));
            expect(memory.write.mock.calls[i][1]).toStrictEqual(valueb[i]);
        }
    }
});

test('implements move register to register pointer', () => {
    for (const register of [Mnemonics.ah, Mnemonics.ax, Mnemonics.eax]) {
        memory.write = jest.fn();
        const mem = new Word(random(Word));
        const type = new RegisterAddress(register).getType();
        const value = new type(random(type));
        const valueb = value.expand();
        const instruction = [Mnemonics.movrp, Mnemonics.bx, register, new Byte(0x00)];

        registers.get = reg => {
            if (reg.eq(new RegisterAddress(register))) {
                return value;
            } else if (reg.eq(new RegisterAddress(Mnemonics.bx))) {
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
        Mnemonics.ah, Mnemonics.al, Mnemonics.eax,
        Mnemonics.bh, Mnemonics.bl, Mnemonics.ebx,
        Mnemonics.ch, Mnemonics.cl, Mnemonics.ecx,
        Mnemonics.dh, Mnemonics.dl, Mnemonics.edx,
    ];
    for (const register of forbidden) {
        const instruction = [Mnemonics.movrp, register, Mnemonics.ah, new Byte(0x00)];
        expect(() => interpreter.exec(instruction))
            .toThrow(`Cannot use register ${new RegisterAddress(register).format()} as pointer`)
    }
});

test('implements move register to memory pointer', () => {
    for (const register of [Mnemonics.ah, Mnemonics.ax, Mnemonics.eax]) {
        memory.write = jest.fn();
        const ptr = new Word(random(Word));
        const mem = new Word(random(Word));
        const type = new RegisterAddress(register).getType();
        const value = new type(random(type));
        const valueb = value.expand();
        const instruction = [Mnemonics.movrmp, ...ptr.expand(), register];

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
    let instruction = [Mnemonics.mov, Mnemonics.al, Mnemonics.bl, new Byte(0x00)];
    let exit = interpreter.exec(instruction);

    expect(exit).toBeInstanceOf(Exit);
    expect(exit.shouldExit()).toBe(false);

    const value = new Byte(random(Byte));
    instruction = [Mnemonics.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00)];

    registers.get = jest.fn(reg => reg.eq(new RegisterAddress(Mnemonics.eax)) ? Interpreter.SYS_EXIT : value);

    exit = interpreter.exec(instruction);

    expect(registers.get).nthCalledWith(1, new RegisterAddress(Mnemonics.eax));
    expect(registers.get).nthCalledWith(2, new RegisterAddress(Mnemonics.ebx));
    expect(exit).toBeInstanceOf(Exit);
    expect(exit.shouldExit()).toBe(true);
    expect(exit.getExitStatus()).toStrictEqual(value);
});

test('implement syscall write', () => {
    const fd = new Byte(random(Byte));
    const buf = new Word(random(Word));
    const count = new Word(random(Word));
    const bytes = new Double(random(Double)).expand();
    const written = random(Byte);
    const instruction = [Mnemonics.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00)];

    registers.get = reg => {
        if (reg.eq(new RegisterAddress(Mnemonics.eax))) {
            return Interpreter.SYS_WRITE;
        } else if (reg.eq(new RegisterAddress(Mnemonics.ebx))) {
            return fd;
        } else if (reg.eq(new RegisterAddress(Mnemonics.ecx))) {
            return buf;
        } else if (reg.eq(new RegisterAddress(Mnemonics.edx))) {
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

    expect(registers.set.mock.calls[0][0]).toStrictEqual(new RegisterAddress(Mnemonics.eax));
    expect(registers.set.mock.calls[0][1]).toStrictEqual(new Double(written));
});
