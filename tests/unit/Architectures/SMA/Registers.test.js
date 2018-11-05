const ControlRegisters = require('../../../../src/ProcessorInterfaces/Registers');
const Registers = require('../../../../src/Architectures/SMA/Registers');
const Register = require('../../../../src/Architectures/SMA/Mnemonics').register;
const RegisterAddress = require('../../../../src/Architectures/SMA/RegisterAddress');
const Double = require('../../../../src/DataTypes/Double');
const Word = require('../../../../src/DataTypes/Word');
const Byte = require('../../../../src/DataTypes/Byte');
const random = require('../../random');

/**
 * @type {null|Registers}
 */
let registers = null;

beforeEach(() => {
    registers = new Registers(Register);
});

test('implements control registers', () => {
    expect(registers instanceof ControlRegisters).toBe(true);
});

test('implements data registers', () => {
    for (const t of ['a', 'b', 'c', 'd']) {
        const ex = new Double(random(Double));
        const exb = ex.expand();

        registers.set(new RegisterAddress(Register[`e${t}x`]), ex);

        expect(registers.get(new RegisterAddress(Register[`e${t}x`]))).toStrictEqual(ex);
        expect(registers.get(new RegisterAddress(Register[`${t}x`]))).toStrictEqual(new Word(exb[2], exb[3]));
        expect(registers.get(new RegisterAddress(Register[`${t}h`]))).toStrictEqual(new Byte(exb[2]));
        expect(registers.get(new RegisterAddress(Register[`${t}l`]))).toStrictEqual(new Byte(exb[3]));

        const x = new Word(random(Word));
        const xb = x.expand();

        registers.set(new RegisterAddress(Register[`${t}x`]), x);

        expect(registers.get(new RegisterAddress(Register[`e${t}x`]))).toStrictEqual(new Double(exb[0], exb[1], xb[0], xb[1]));
        expect(registers.get(new RegisterAddress(Register[`${t}x`]))).toStrictEqual(x);
        expect(registers.get(new RegisterAddress(Register[`${t}h`]))).toStrictEqual(xb[0]);
        expect(registers.get(new RegisterAddress(Register[`${t}l`]))).toStrictEqual(xb[1]);

        const h = new Byte(random(Byte));
        const l = new Byte(random(Byte));

        registers.set(new RegisterAddress(Register[`${t}h`]), h);
        registers.set(new RegisterAddress(Register[`${t}l`]), l);

        expect(registers.get(new RegisterAddress(Register[`e${t}x`]))).toStrictEqual(new Double(exb[0], exb[1], h, l));
        expect(registers.get(new RegisterAddress(Register[`${t}x`]))).toStrictEqual(new Word(h, l));
        expect(registers.get(new RegisterAddress(Register[`${t}h`]))).toStrictEqual(h);
        expect(registers.get(new RegisterAddress(Register[`${t}l`]))).toStrictEqual(l);
    }
});

test('implements instruction pointer', () => {
    const ip = new Word(random(Word));
    registers.setIp(ip);
    expect(registers.getIp()).toStrictEqual(ip);
});

test('implements exit registers', () => {
    expect(registers.shouldExit()).toBe(false);

    const status = new Byte(random(Byte));

    registers.setExit(status);

    expect(registers.shouldExit()).toBe(true);
    expect(registers.getExitStatus()).toBe(status);
});

test('implements result low registers', () => {
    expect(registers.getResultLowRegister()).toBe(Register.edx);
    expect(registers.getResultLowRegisterAlternate()).toBe(Register.eax);
});

test('implements register equal flag', () => {
    const flags = [Registers.FLAG_EQ, Registers.FLAG_LT, Registers.FLAG_GT];

    for (const flag of flags) {
        registers.setFlag(flag, true);
        expect(registers.getFlag(flag)).toStrictEqual(true);

        registers.setFlag(flag, false);
        expect(registers.getFlag(flag)).toStrictEqual(false);
    }
});

test('fails if trying to get non-set flag', () => {
    const flags = [Registers.FLAG_EQ, Registers.FLAG_LT, Registers.FLAG_GT];

    for (const flag of flags) {
        expect(() => registers.getFlag(flag)).toThrow(new Error(`Flag ${flag} has not been set`));
    }
});
