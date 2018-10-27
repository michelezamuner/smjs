const Syscall = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Syscall');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
const Memory = require('../../../../../src/ProcessorInterfaces/Memory');
const System = require('../../../../../src/Architectures/SMA/System');
const Byte = require('../../../../../src/DataTypes/Byte');
const Word = require('../../../../../src/DataTypes/Word');
const Double = require('../../../../../src/DataTypes/Double');
const random = require('../../../random');
const Register = require('../../../../../src/Architectures/SMA/Mnemonics').register;
const RegisterAddress = require('../../../../../src/Architectures/SMA/RegisterAddress');

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
    const value = new Double(new Byte(0x00), new Byte(0x00), new Byte(random(Byte)), new Byte(random(Byte)));

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

test('implements syscall write', () => {
    const fd = new Byte(random(Byte));
    const buf = new Word(random(Word));
    const count = new Word(random(Word));
    const bytes = new Double(random(Double)).expand();
    const written = random(Byte);

    registers.get = reg => {
        if (reg.eq(new RegisterAddress(Register.eax))) {
            return Syscall.SYS_WRITE;
        } else if (reg.eq(new RegisterAddress(Register.ebx))) {
            return fd;
        } else if (reg.eq(new RegisterAddress(Register.ecx))) {
            return buf;
        } else if (reg.eq(new RegisterAddress(Register.edx))) {
            return count;
        }
    };

    memory.readSet = (addr, size) => addr.eq(buf) && size.eq(count) ? bytes : [];

    system.write = (fdArg, bufArg, countArg) => {
        const expectedBuf = new Double(...bytes);
        const actualBuf = new Double(...bufArg.map(value => new Byte(value)));
        if (fdArg === fd.uint() && actualBuf.eq(expectedBuf) && countArg === count.uint()) {
            return written;
        }

        return null;
    };

    definition.exec();

    expect(registers.set.mock.calls[0][0]).toStrictEqual(new RegisterAddress(Register.eax));
    expect(registers.set.mock.calls[0][1]).toStrictEqual(new Double(written));
});
