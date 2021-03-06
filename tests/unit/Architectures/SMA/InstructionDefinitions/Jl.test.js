const Jl = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Jl');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
const Word = require('../../../../../src/DataTypes/Word');
const random = require('../../../random');

/**
 * @type {Object}
 */
const registers = {};

/**
 * @type {null|Jl}
 */
let definition = null;

beforeEach(() => {
    registers.setIp = jest.fn();
    definition = new Jl(registers);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Jl.getDependencies()).toStrictEqual([Registers]);
});

test('jump if less flag is raised', () => {
    const instructionAddress = random(Word);

    registers.getFlag = flag => flag === Registers.FLAG_LT ? true : null;

    definition.exec(...instructionAddress.expand());

    expect(registers.setIp.mock.calls[0][0]).toStrictEqual(instructionAddress);
});

test('does not jump if less flag is not raised', () => {
    const instructionAddress = random(Word);

    registers.getFlag = flag => flag === Registers.FLAG_LT ? false : null;

    definition.exec(...instructionAddress.expand());

    expect(registers.setIp).not.toBeCalled();
});
