const Mul = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Mul');
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
 * @type {null|Mul}
 */
let definition = null;

beforeEach(() => {
    registers.set = jest.fn();
    definition = new Mul(registers);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Mul.getDependencies()).toStrictEqual([Registers]);
});

test('implements multiply register byte by register byte', () => {
    const multiplicand = new Byte(random(Byte));
    const multiplier = new Byte(random(Byte));
    const multiplicandRegister = Register.al;
    const multiplierRegister = Register.bl;
    const resultRegister = Register.ax;

    registers.get = reg => {
        if (reg.eq(new RegisterAddress(multiplicandRegister))) {
            return multiplicand;
        } else if (reg.eq(new RegisterAddress(multiplierRegister))) {
            return multiplier;
        }

        return null;
    };

    definition.exec(multiplicandRegister, multiplierRegister);

    expect(registers.set.mock.calls[0][0]).toStrictEqual(new RegisterAddress(resultRegister));
    expect(registers.set.mock.calls[0][1]).toStrictEqual(new Word(parseInt(multiplicand) * parseInt(multiplier)));
});

test('implements multiply register word by register word', () => {
    const multiplicand = new Word(random(Word));
    const multiplier = new Word(random(Word));
    const multiplicandRegister = Register.ax;
    const multiplierRegister = Register.bx;
    const resultRegister = Register.eax;

    registers.get = reg => {
        if (reg.eq(new RegisterAddress(multiplicandRegister))) {
            return multiplicand;
        } else if (reg.eq(new RegisterAddress(multiplierRegister))) {
            return multiplier;
        }

        return null;
    };

    definition.exec(multiplicandRegister, multiplierRegister);

    expect(registers.set.mock.calls[0][0]).toStrictEqual(new RegisterAddress(resultRegister));
    expect(registers.set.mock.calls[0][1]).toStrictEqual(new Double(parseInt(multiplicand) * parseInt(multiplier)));
});

test('implements multiply register double by register double', () => {
    const multiplicand = new Double(random(Double));
    const multiplier = new Double(random(Double));
    const result = parseInt(multiplicand) * parseInt(multiplier);
    const modulo = 2 ** 32;
    const resultHigh = Math.floor(result / modulo);
    const resultLow = result % modulo;
    const multiplicandRegister = Register.eax;
    const multiplierRegister = Register.ebx;
    const resultHighRegister = multiplicandRegister;
    const resultLowRegister = Register.edx;

    registers.get = reg => {
        if (reg.eq(new RegisterAddress(multiplicandRegister))) {
            return multiplicand;
        } else if (reg.eq(new RegisterAddress(multiplierRegister))) {
            return multiplier;
        }

        return null;
    };
    registers.getResultLowRegister = () => Register.edx;

    definition.exec(multiplicandRegister, multiplierRegister);

    expect(registers.set.mock.calls[0][0]).toStrictEqual(new RegisterAddress(resultHighRegister));
    expect(registers.set.mock.calls[0][1]).toStrictEqual(new Double(resultHigh));
    expect(registers.set.mock.calls[1][0]).toStrictEqual(new RegisterAddress(resultLowRegister));
    expect(registers.set.mock.calls[1][1]).toStrictEqual(new Double(resultLow));
});

test('implements multiply register double by register double with alternate register', () => {
    const multiplicand = new Double(random(Double));
    const multiplier = new Double(random(Double));
    const result = parseInt(multiplicand) * parseInt(multiplier);
    const modulo = 2 ** 32;
    const resultHigh = Math.floor(result / modulo);
    const resultLow = result % modulo;
    const multiplicandRegister = Register.edx;
    const multiplierRegister = Register.eax;
    const resultHighRegister = multiplicandRegister;
    const resultLowRegister = Register.eax;

    registers.get = reg => {
        if (reg.eq(new RegisterAddress(multiplicandRegister))) {
            return multiplicand;
        } else if (reg.eq(new RegisterAddress(multiplierRegister))) {
            return multiplier;
        }

        return null;
    };
    registers.getResultLowRegisterAlternate = () => Register.eax;

    definition.exec(multiplicandRegister, multiplierRegister);

    expect(registers.set.mock.calls[0][0]).toStrictEqual(new RegisterAddress(resultHighRegister));
    expect(registers.set.mock.calls[0][1]).toStrictEqual(new Double(resultHigh));
    expect(registers.set.mock.calls[1][0]).toStrictEqual(new RegisterAddress(resultLowRegister));
    expect(registers.set.mock.calls[1][1]).toStrictEqual(new Double(resultLow));
});

test('fails if type mismatch when multiplying register by register', () => {
    const quarter = ['ah', 'al', 'bh', 'bl', 'ch', 'cl', 'dh', 'dl'];
    const half = ['ax', 'bx', 'cx', 'dx'];
    const whole = ['eax', 'ebx', 'ecx', 'edx'];
    const randomRegister = array => array[Math.floor(Math.random() * array.length)];
    const forbidden = [
        [randomRegister(quarter), randomRegister(half)],
        [randomRegister(quarter), randomRegister(whole)],
        [randomRegister(half), randomRegister(quarter)],
        [randomRegister(half), randomRegister(whole)],
        [randomRegister(whole), randomRegister(quarter)],
        [randomRegister(whole), randomRegister(half)],
    ];

    for (const couple of forbidden) {
        const multiplicand = Register[couple[0]];
        const multiplier = Register[couple[1]];

        expect(() => definition.exec(multiplicand, multiplier))
            .toThrow(new Error(`Type mismatch: cannot multiply register ${multiplicand} by register ${multiplier}`));
    }
});
