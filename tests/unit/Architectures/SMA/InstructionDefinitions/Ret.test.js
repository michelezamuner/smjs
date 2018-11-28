const Ret = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Ret');
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
 * @type {null|Ret}
 */
let definition = null;

beforeEach(() => {
    registers.setIp = jest.fn();
    definition = new Ret(registers, stack);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Ret.getDependencies()).toStrictEqual([Registers, Stack]);
});

test('pops stack frame and jumps to the return address', () => {
    const returnAddress = new Word(random(Word));

    stack.popFrame = () => returnAddress;

    definition.exec();

    expect(registers.setIp.mock.calls[0][0]).toStrictEqual(returnAddress);
});
