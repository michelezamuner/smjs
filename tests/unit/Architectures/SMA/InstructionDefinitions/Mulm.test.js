const Mulm = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Mulm');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
const Register = require('../../../../../src/Architectures/SMA/Mnemonics').register;
const RegisterAddress = require('../../../../../src/Architectures/SMA/RegisterAddress');
const Memory = require('../../../../../src/ProcessorInterfaces/Memory');
const Byte = require('../../../../../src/DataTypes/Byte');
const Word = require('../../../../../src/DataTypes/Word');
const Double = require('../../../../../src/DataTypes/Double');
const random = require('../../../random');

/**
 * @type {Object}
 */
const registers = {};

/**
 * @type {Object}
 */
const memory = {};

/**
 * @type {null|Mulm}
 */
let definition=  null;

beforeEach(() => {
    registers.set = jest.fn();
    definition = new Mulm(registers, memory);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Mulm.getDependencies()).toStrictEqual([Registers, Memory]);
});

test('implements multiply register byte by memory', () => {
    const multiplicand = random(Byte);
    const multiplier = random(Byte);
    const mem = random(Word);
    const names = ['a', 'b', 'c', 'd'];

    for (const i in names) {
        const x = names[i];
        const multiplicandRegister = Register[`${x}l`];
        const resultRegister = Register[`${x}x`];

        registers.get = reg => reg.eq(new RegisterAddress(multiplicandRegister)) ? multiplicand : null;
        memory.read = (addr, size) => addr.eq(mem) && size.eq(Byte.SIZE) ? multiplier.expand() : null;

        definition.exec(multiplicandRegister, ...mem.expand());

        expect(registers.set.mock.calls[i][0]).toStrictEqual(new RegisterAddress(resultRegister));
        expect(registers.set.mock.calls[i][1]).toStrictEqual(new Word(parseInt(multiplicand) * parseInt(multiplier)));
    }
});


test('implements multiply register word by memory', () => {
    const multiplicand = random(Word);
    const multiplier = random(Word);
    const mem = random(Word);
    const names = ['a', 'b', 'c', 'd'];

    for (const i in names) {
        const x = names[i];
        const multiplicandRegister = Register[`${x}x`];
        const resultRegister = Register[`e${x}x`];

        registers.get = reg => reg.eq(new RegisterAddress(multiplicandRegister)) ? multiplicand : null;
        memory.read = (addr, size) => addr.eq(mem) && size.eq(Word.SIZE) ? multiplier.expand() : null;

        definition.exec(multiplicandRegister, ...mem.expand());

        expect(registers.set.mock.calls[i][0]).toStrictEqual(new RegisterAddress(resultRegister));
        expect(registers.set.mock.calls[i][1]).toStrictEqual(new Double(parseInt(multiplicand) * parseInt(multiplier)));
    }
});

test('implements multiply register double by memory', () => {
    const multiplicand = random(Word).cast(Double);
    const multiplier = random(Double);
    const result = parseInt(multiplicand) * parseInt(multiplier);
    const modulo = 2 ** 32;
    const resultHigh = Math.floor(result / modulo);
    const resultLow = result % modulo;
    const mem = new Word(random(Word));
    const names = ['a', 'b', 'c', 'd'];

    for (const i in names) {
        const x = names[i];
        const multiplicandRegister = Register[`e${x}x`];
        const resultLowRegister = x === 'd' ? Register.eax : Register.edx;
        const resultHighRegister = multiplicandRegister;

        registers.get = reg => reg.eq(new RegisterAddress(multiplicandRegister)) ? multiplicand : null;
        registers.getResultLowRegister = () => Register.edx;
        registers.getResultLowRegisterAlternate = () => Register.eax;
        memory.read = (addr, size) => addr.eq(mem) && size.eq(Double.SIZE) ? multiplier.expand() : null;

        definition.exec(multiplicandRegister, ...mem.expand());

        expect(registers.set.mock.calls[i * 2][0]).toStrictEqual(new RegisterAddress(resultHighRegister));
        expect(registers.set.mock.calls[i * 2][1]).toStrictEqual(new Double(resultHigh));
        expect(registers.set.mock.calls[i * 2 + 1][0]).toStrictEqual(new RegisterAddress(resultLowRegister));
        expect(registers.set.mock.calls[i * 2 + 1][1]).toStrictEqual(new Double(resultLow));
    }
});
