const Jle = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Jle');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
const Word = require('../../../../../src/DataTypes/Word');
const random = require('../../../random');

/**
 * @type {Object}
 */
const registers = {};

/**
 * @type {null|Jle}
 */
let definition = null;

beforeEach(() => {
    registers.setIp = jest.fn();
    definition = new Jle(registers);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Jle.getDependencies()).toStrictEqual([Registers]);
});

test('jumps if less flag is raised and equal flag is not raised', () => {
    const instructionAddress = new Word(random(Word));

    registers.getFlag = flag => {
        if (flag === Registers.FLAG_LT) {
            return true;
        } else if (flag === Registers.FLAG_EQ) {
            return false;
        }

        return null;
    };

    definition.exec(...instructionAddress.expand());

    expect(registers.setIp.mock.calls[0][0]).toStrictEqual(instructionAddress);
});

test('jumps if less flag is raised and equal flag is raised', () => {
    const instructionAddress = new Word(random(Word));

    registers.getFlag = flag => {
        if (flag === Registers.FLAG_LT) {
            return true;
        } else if (flag === Registers.FLAG_EQ) {
            return true;
        }

        return null;
    };

    definition.exec(...instructionAddress.expand());

    expect(registers.setIp.mock.calls[0][0]).toStrictEqual(instructionAddress);
});

test('jumps if less flag is not raised and equal flag is raised', () => {
    const instructionAddress = new Word(random(Word));

    registers.getFlag = flag => {
        if (flag === Registers.FLAG_LT) {
            return false;
        } else if (flag === Registers.FLAG_EQ) {
            return true;
        }

        return null;
    };

    definition.exec(...instructionAddress.expand());

    expect(registers.setIp.mock.calls[0][0]).toStrictEqual(instructionAddress);
});

test('does not jump if less flag is not raised and equal flag is not raised', () => {
    const instructionAddress = new Word(random(Word));

    registers.getFlag = flag => {
        if (flag === Registers.FLAG_LT) {
            return false;
        } else if (flag === Registers.FLAG_EQ) {
            return false;
        }

        return null;
    };

    definition.exec(...instructionAddress.expand());

    expect(registers.setIp).not.toBeCalled();
});
