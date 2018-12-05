const Movrmp = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Movrmp');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
const Memory = require('../../../../../src/ProcessorInterfaces/Memory');
const Byte = require('../../../../../src/DataTypes/Byte');
const Word = require('../../../../../src/DataTypes/Word');
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
 * @type {null|Movrmp}
 */
let definition = null;

beforeEach(() => {
    definition = new Movrmp(registers, memory);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Movrmp.getDependencies()).toStrictEqual([Registers, Memory]);
});

test('implements move register to memory pointer', () => {
    for (const register of [Register.ah, Register.ax, Register.eax]) {
        memory.write = jest.fn();
        const ptr = random(Word);
        const mem = random(Word);
        const type = new RegisterAddress(register).getType();
        const value = random(type);
        const valueb = value.expand();

        registers.get = reg => reg.eq(new RegisterAddress(register)) ? value : null;
        memory.readSet = (addr, size) => addr.eq(ptr) && size.eq(Word.SIZE) ? mem.expand() : null;

        definition.exec(...ptr.expand(), register);

        for (let i = 0; i < type.SIZE; i++) {
            expect(memory.write.mock.calls[i][0]).toStrictEqual(mem.add(new Byte(i)));
            expect(memory.write.mock.calls[i][1]).toStrictEqual(valueb[i]);
        }
    }
});
