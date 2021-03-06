const Movipw = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Movipw');
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
 * @type {null|Movipw}
 */
let definition = null;

beforeEach(() => {
    memory.write = jest.fn();
    definition = new Movipw(registers, memory);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Movipw.getDependencies()).toStrictEqual([Registers, Memory]);
});

test('implements move immediate to byte register pointer', () => {
    const value = random(Word);
    const address = random(Word);

    registers.get = reg => reg.eq(new RegisterAddress(Register.ax)) ? address : null;

    definition.exec(Register.ax, ...value.expand());

    expect(memory.write.mock.calls[0][0]).toStrictEqual(address);
    expect(memory.write.mock.calls[0][1]).toStrictEqual(value);
});

test('fails if size mismatch on move immediate to byte register pointer', () => {
    const forbidden = ['ah', 'al', 'eax', 'bh', 'bl', 'ebx', 'ch', 'cl', 'ecx', 'dh', 'dl', 'edx'];
    for (const register of forbidden) {
        const value = random(Word);
        expect(() => definition.exec(Register[register], ...value.expand()))
            .toThrow(`Cannot use register ${new RegisterAddress(Register[register])} as pointer`);
    }
});

test('fails if size mismatch on move immediate to byte register pointer', () => {
    const forbidden = ['ah', 'al', 'eax', 'bh', 'bl', 'ebx', 'ch', 'cl', 'ecx', 'dh', 'dl', 'edx'];
    for (const register of forbidden) {
        const value = random(Word);
        expect(() => definition.exec(Register[register], ...value.expand()))
            .toThrow(`Cannot use register ${new RegisterAddress(Register[register])} as pointer`);
    }
});
