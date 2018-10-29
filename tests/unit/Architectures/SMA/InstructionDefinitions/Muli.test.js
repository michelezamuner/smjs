const Muli = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Muli');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
const Register = require('../../../../../src/Architectures/SMA/Mnemonics').register;
const RegisterAddress = require('../../../../../src/Architectures/SMA/RegisterAddress');
const Byte = require('../../../../../src/DataTypes/Byte');
const Word = require('../../../../../src/DataTypes/Word');
const Double = require('../../../../../src/DataTypes/Double');
const random = require('../../../random');

/**
 * @type {Object}
 */
const registers = {};

/**
 * @type {null|Muli}
 */
let definition = null;

beforeEach(() => {
    registers.set = jest.fn();
    definition = new Muli(registers);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Muli.getDependencies()).toStrictEqual([Registers]);
});

test('implements multiply immediate byte to register byte', () => {
    const multiplicand = new Byte(random(Byte));
    const multiplier = new Word(random(Word));
    const bytes = multiplier.expand();
    const names = ['a', 'b', 'c', 'd'];

    for (const i in names) {
        const x = names[i];
        const multiplicandRegister = Register[`${x}l`];
        const resultRegister = Register[`${x}x`];

        registers.get = reg => reg.eq(new RegisterAddress(multiplicandRegister)) ? multiplicand : null;

        definition.exec(multiplicandRegister, ...bytes);

        expect(registers.set.mock.calls[i][0]).toStrictEqual(new RegisterAddress(resultRegister));
        expect(registers.set.mock.calls[i][1]).toStrictEqual(new Word(parseInt(multiplicand) * parseInt(bytes[1])));
    }
});

test('implements multiply immediate word to register word', () => {
    const multiplicand = new Word(random(Word));
    const multiplier = new Word(random(Word));
    const names = ['a', 'b', 'c', 'd'];

    for (const i in names) {
        const x = names[i];
        const multiplicandRegister = Register[`${x}x`];
        const resultRegister = Register[`e${x}x`];

        registers.get = reg => reg.eq(new RegisterAddress(multiplicandRegister)) ? multiplicand : null;

        definition.exec(multiplicandRegister, ...multiplier.expand());

        expect(registers.set.mock.calls[i][0]).toStrictEqual(new RegisterAddress(resultRegister));
        expect(registers.set.mock.calls[i][1]).toStrictEqual(new Double(parseInt(multiplicand) * parseInt(multiplier)));
    }
});
