const Syscall = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Syscall');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
const Memory = require('../../../../../src/ProcessorInterfaces/Memory');
const System = require('../../../../../src/Architectures/SMA/System');
const Byte = require('../../../../../src/DataTypes/Byte');
const Word = require('../../../../../src/DataTypes/Word');
const Double = require('../../../../../src/DataTypes/Double');
const Register = require('../../../../../src/Architectures/SMA/Mnemonics').register;
const RegisterAddress = require('../../../../../src/Architectures/SMA/RegisterAddress');
const random = require('../../../random');

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
 * @type {null|Syscall}
 */
let definition = null;

beforeEach(() => {
    registers.set = jest.fn();
    registers.setExit = jest.fn();
    definition = new Syscall(registers, memory, system);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Syscall.getDependencies()).toStrictEqual([Registers, Memory, System]);
});

test('implements syscall exit', () => {
    const value = new Double(new Byte(0x00), new Byte(0x00), random(Byte), random(Byte));

    registers.get = reg => {
        if (reg.eq(new RegisterAddress(Register.eax))) {
            return Syscall.SYS_EXIT;
        } else if (reg.eq(new RegisterAddress(Register.ebx))) {
            return value;
        }

        return null;
    };

    definition.exec();

    expect(registers.setExit.mock.calls[0][0]).toStrictEqual(value.expand()[3]);
});

test('implements syscall read', () => {
    const fd = random(Byte);
    const mem = random(Word);
    const count = random(Word);
    const read = parseInt(random(Byte));
    const bytes = [];
    for (let i = 0; i < read; i++) {
        bytes.push(random(Byte));
    }

    memory.write = jest.fn();

    registers.get = reg => {
        if (reg.eq(new RegisterAddress(Register.eax))) {
            return Syscall.SYS_READ;
        } else if (reg.eq(new RegisterAddress(Register.ebx))) {
            return fd;
        } else if (reg.eq(new RegisterAddress(Register.ecx))) {
            return mem;
        } else if (reg.eq(new RegisterAddress(Register.edx))) {
            return count;
        }
    };

    system.read = (fdArg, bufArg, countArg) => {
        if (fdArg === parseInt(fd) && bufArg instanceof Buffer && countArg === parseInt(count)) {
            for (let i = 0; i < read; i++) {
                bufArg.writeUInt8(parseInt(bytes[i]), i);
            }

            return read;
        }

        return null;
    };

    definition.exec();

    for (let i = 0; i < read; i++) {
        expect(memory.write.mock.calls[i][0]).toStrictEqual(mem.add(new Word(i)));
        expect(memory.write.mock.calls[i][1]).toStrictEqual(bytes[i]);
    }
    expect(registers.set.mock.calls[0][0]).toStrictEqual(new RegisterAddress(Register.eax));
    expect(registers.set.mock.calls[0][1]).toStrictEqual(new Double(read));
});

test('implements syscall write', () => {
    const fd = random(Byte);
    const mem = random(Word);
    const count = random(Word);
    const bytes = random(Double).expand();
    const written = random(Double);

    registers.get = reg => {
        if (reg.eq(new RegisterAddress(Register.eax))) {
            return Syscall.SYS_WRITE;
        } else if (reg.eq(new RegisterAddress(Register.ebx))) {
            return fd;
        } else if (reg.eq(new RegisterAddress(Register.ecx))) {
            return mem;
        } else if (reg.eq(new RegisterAddress(Register.edx))) {
            return count;
        }
    };

    memory.read = (addr, size) => addr.eq(mem) && size.eq(count) ? bytes : [];

    system.write = (fdArg, bufArg, countArg) => {
        const expectedBuf = new Double(...bytes);
        const actualBuf = new Double(...bufArg.map(value => new Byte(value)));
        if (fdArg === parseInt(fd) && actualBuf.eq(expectedBuf) && countArg === parseInt(count)) {
            return written;
        }

        return null;
    };

    definition.exec();

    expect(registers.set.mock.calls[0][0]).toStrictEqual(new RegisterAddress(Register.eax));
    expect(registers.set.mock.calls[0][1]).toStrictEqual(new Double(written));
});
