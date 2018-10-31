const Movrm = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Movrm');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
const Memory = require('../../../../../src/ProcessorInterfaces/Memory');
const Byte = require('../../../../../src/DataTypes/Byte');
const Word = require('../../../../../src/DataTypes/Word');
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
 * @type {null|Movrm}
 */
let definition = null;

beforeEach(() => {
    definition = new Movrm(registers, memory);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Movrm.getDependencies()).toStrictEqual([Registers, Memory]);
});

test('implements move register to memory', () => {
    for (const register of [Register.ah, Register.ax, Register.eax]) {
        memory.write = jest.fn();
        const mem = new Word(random(Word));
        const type = new RegisterAddress(register).getType();
        const value = new type(random(type));
        const valueb = value.expand();

        registers.get = reg => reg.eq(new RegisterAddress(register)) ? value : null;

        definition.exec(...mem.expand(), register);

        for (let i = 0; i < type.SIZE; i++) {
            expect(memory.write.mock.calls[i][0]).toStrictEqual(mem.add(new Byte(i)));
            expect(memory.write.mock.calls[i][1]).toStrictEqual(valueb[i]);
        }
    }
});