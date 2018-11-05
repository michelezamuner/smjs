const Jmp = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Jmp');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
const Word = require('../../../../../src/DataTypes/Word');
const random = require('../../../random');

/**
 * @type {Object}
 */
const registers = {};

/**
 * @type {null|Jmp}
 */
let definition = null;

beforeEach(() => {
    registers.setIp = jest.fn();
    definition = new Jmp(registers);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Jmp.getDependencies()).toStrictEqual([Registers]);
});

test('implements unconditional jump', () => {
    const instructionAddress = new Word(random(Word));

    definition.exec(...instructionAddress.expand());

    expect(registers.setIp.mock.calls[0][0]).toStrictEqual(instructionAddress);
});
