const Jge = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Jge');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
const Word = require('../../../../../src/DataTypes/Word');
const random = require('../../../random');

/**
 * @type {Object}
 */
const registers = {};

/**
 * @type {null|Jge}
 */
let definition = null;

beforeEach(() => {
    registers.setIp = jest.fn();
    definition = new Jge(registers);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Jge.getDependencies()).toStrictEqual([Registers]);
});

test('jumps if greater flag is raised and equal flag is not raised', () => {
    const instructionAddress = random(Word);

    registers.getFlag = flag => {
        if (flag === Registers.FLAG_GT) {
            return true;
        } else if (flag === Registers.FLAG_EQ) {
            return false;
        }

        return null;
    };

    definition.exec(...instructionAddress.expand());

    expect(registers.setIp.mock.calls[0][0]).toStrictEqual(instructionAddress);
});

test('jumps if greater flag is raised and equal flag is raised', () => {
    const instructionAddress = random(Word);

    registers.getFlag = flag => {
        if (flag === Registers.FLAG_GT) {
            return true;
        } else if (flag === Registers.FLAG_EQ) {
            return true;
        }

        return null;
    };

    definition.exec(...instructionAddress.expand());

    expect(registers.setIp.mock.calls[0][0]).toStrictEqual(instructionAddress);
});

test('jumps if greater flag is not raised and equal flag is raised', () => {
    const instructionAddress = random(Word);

    registers.getFlag = flag => {
        if (flag === Registers.FLAG_GT) {
            return false;
        } else if (flag === Registers.FLAG_EQ) {
            return true;
        }

        return null;
    };

    definition.exec(...instructionAddress.expand());

    expect(registers.setIp.mock.calls[0][0]).toStrictEqual(instructionAddress);
});

test('does not jump if greater flag is not raised and equal flag is not raised', () => {
    const instructionAddress = random(Word);

    registers.getFlag = flag => {
        if (flag === Registers.FLAG_GT) {
            return false;
        } else if (flag === Registers.FLAG_EQ) {
            return false;
        }

        return null;
    };

    definition.exec(...instructionAddress.expand());

    expect(registers.setIp).not.toBeCalled();
});
