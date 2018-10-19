const ControlRegisters = require('../../../../src/ProcessorInterfaces/Registers');
const Registers = require('../../../../src/Architectures/SMA/Registers');
const Register = require('../../../../src/Architectures/SMA/Mnemonics').register;
const RegisterAddress = require('../../../../src/Architectures/SMA/RegisterAddress');
const Double = require('../../../../src/DataTypes/Double');
const Word = require('../../../../src/DataTypes/Word');
const Byte = require('../../../../src/DataTypes/Byte');
const random = require('../../random');

/**
 * @type {Registers}
 */
let registers = null;

beforeEach(() => {
    registers = new Registers();
});

test('Implements control registers', () => {
    expect(registers instanceof ControlRegisters).toBe(true);
});

test('Implements data registers', () => {
    for (const t of ['a', 'b', 'c', 'd']) {
        let ex = new Double(random(Double));
        let exb = ex.expand();

        registers.set(new RegisterAddress(Register[`e${t}x`]), ex);

        expect(registers.get(new RegisterAddress(Register[`e${t}x`]))).toStrictEqual(ex);
        expect(registers.get(new RegisterAddress(Register[`${t}x`]))).toStrictEqual(new Word(exb[2], exb[3]));
        expect(registers.get(new RegisterAddress(Register[`${t}h`]))).toStrictEqual(new Byte(exb[2]));
        expect(registers.get(new RegisterAddress(Register[`${t}l`]))).toStrictEqual(new Byte(exb[3]));

        let x = new Word(random(Word));
        let xb = x.expand();

        registers.set(new RegisterAddress(Register[`${t}x`]), x);

        expect(registers.get(new RegisterAddress(Register[`e${t}x`]))).toStrictEqual(new Double(exb[0], exb[1], xb[0], xb[1]));
        expect(registers.get(new RegisterAddress(Register[`${t}x`]))).toStrictEqual(x);
        expect(registers.get(new RegisterAddress(Register[`${t}h`]))).toStrictEqual(xb[0]);
        expect(registers.get(new RegisterAddress(Register[`${t}l`]))).toStrictEqual(xb[1]);

        let h = new Byte(random(Byte));
        let l = new Byte(random(Byte));

        registers.set(new RegisterAddress(Register[`${t}h`]), h);
        registers.set(new RegisterAddress(Register[`${t}l`]), l);

        expect(registers.get(new RegisterAddress(Register[`e${t}x`]))).toStrictEqual(new Double(exb[0], exb[1], h, l));
        expect(registers.get(new RegisterAddress(Register[`${t}x`]))).toStrictEqual(new Word(h, l));
        expect(registers.get(new RegisterAddress(Register[`${t}h`]))).toStrictEqual(h);
        expect(registers.get(new RegisterAddress(Register[`${t}l`]))).toStrictEqual(l);
    }
});

test('Implements instruction pointer', () => {
    let ip = new Word(random(Word));
    registers.setIp(ip);
    expect(registers.getIp()).toStrictEqual(ip);
});
