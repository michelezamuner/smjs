const Jne = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Jne');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
const Word = require('../../../../../src/DataTypes/Word');
const random = require('../../../random');

/**
 * @type {Object}
 */
const registers = {};

/**
 * @type {null|Jne}
 */
let definition = null;

beforeEach(() => {
    registers.setIp = jest.fn();
    definition = new Jne(registers);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Jne.getDependencies()).toStrictEqual([Registers]);
});

test('jump if equal flag is not raised', () => {
    const instructionAddress = new Word(random(Word));

    registers.getFlag = flag => flag === Registers.FLAG_EQ ? false : null;

    definition.exec(...instructionAddress.expand());

    expect(registers.setIp.mock.calls[0][0]).toStrictEqual(instructionAddress);
});

test('does not jump if equal flag is raised', () => {
    const instructionAddress = new Word(random(Word));

    registers.getFlag = flag => flag === Registers.FLAG_EQ ? true : null;

    definition.exec(...instructionAddress.expand());

    expect(registers.setIp).not.toBeCalled();
});
