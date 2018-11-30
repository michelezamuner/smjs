const Calla = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Calla');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
const Stack = require('../../../../../src/Architectures/SMA/Stack');
const Word = require('../../../../../src/DataTypes/Word');
const Byte = require('../../../../../src/DataTypes/Byte');
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
 * @type {null|Calla}
 */
let definition = null;

beforeEach(() => {
    stack.pushFrame = jest.fn();
    stack.push = jest.fn();
    registers.setIp = jest.fn();
    definition = new Calla(registers, stack);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Calla.getDependencies()).toStrictEqual([Registers, Stack]);
});

test('pushes new stack frame, pops given size of arguments, and jumps to the called procedure', () => {
    const procedureAddress = new Word(random(Word));
    const returnAddress = new Word(random(Word));
    const argumentsSize = new Byte(random(Byte));
    const argumentsBytes = [];
    for (let i = 0; i < parseInt(argumentsSize); i++) {
        argumentsBytes[i] = new Byte(random(Byte));
    }

    registers.getIp = () => returnAddress;

    let popCount = 0;
    stack.pop = type => type === Byte ? argumentsBytes[popCount++] : null;

    definition.exec(...procedureAddress.expand(), argumentsSize);

    expect(stack.pushFrame.mock.calls[0][0]).toStrictEqual(returnAddress);
    for (let i = 0; i < parseInt(argumentsSize); i++) {
        expect(stack.push.mock.calls[i][0]).toStrictEqual(argumentsBytes[argumentsSize - i - 1]);
    }
    expect(registers.setIp.mock.calls[0][0]).toStrictEqual(procedureAddress);
});

