const Call = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Call');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
const Stack = require('../../../../../src/Architectures/SMA/Stack');
const Word = require('../../../../../src/DataTypes/Word');
const random = require('../../../random');

/**
 * @type {Object}
 */
const registers = {};

/**
 * @type {Object}
 */
const stack = {};

/**
 * @type {null|Call}
 */
let definition = null;

beforeEach(() => {
    stack.pushFrame = jest.fn();
    registers.setIp = jest.fn();
    definition = new Call(registers, stack);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Call.getDependencies()).toStrictEqual([Registers, Stack]);
});

test('pushes new stack frame and jumps to the called procedure', () => {
    const instructionSize = 4;
    const currentAddress = new Word(random(Word));
    const procedureAddress = new Word(random(Word));
    const returnAddress = currentAddress.add(new Word(instructionSize));

    registers.getIp = () => currentAddress;

    definition.exec(...procedureAddress.expand());

    expect(stack.pushFrame.mock.calls[0][0]).toStrictEqual(returnAddress);
    expect(registers.setIp.mock.calls[0][0]).toStrictEqual(procedureAddress);
});

