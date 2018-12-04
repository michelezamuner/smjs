const Pushi = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Pushi');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Stack = require('../../../../../src/Architectures/SMA/Stack');
const Word = require('../../../../../src/DataTypes/Word');
const random = require('../../../random');

/**
 * @type {Object}
 */
const stack = {};

/**
 * @type {null|Pushi}
 */
let definition = null;

beforeEach(() => {
    stack.push = jest.fn();
    definition = new Pushi(stack);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependecies', () => {
    expect(Pushi.getDependencies()).toStrictEqual([Stack]);
});

test('pushes immediate value to the stack', () => {
    const value = random(Word);

    definition.exec(...value.expand());

    expect(stack.push.mock.calls[0][0]).toStrictEqual(value);
});
