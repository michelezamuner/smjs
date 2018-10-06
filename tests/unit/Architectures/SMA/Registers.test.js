const ControlRegisters = require('../../../../src/ProcessorInterfaces/Registers');
const Registers = require('../../../../src/Architectures/SMA/Registers');
const Mnemonics = require('../../../../src/Architectures/SMA/Mnemonics');
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
    for (let t of ['a', 'b', 'c', 'd']) {
        let ex = new Double(random(Double));
        let exb = ex.expand();

        registers.set(Mnemonics[`e${t}x`], ex);

        expect(registers.get(Mnemonics[`e${t}x`])).toBeInstanceOf(Double);
        expect(registers.get(Mnemonics[`e${t}x`])).toEqual(ex);
        expect(registers.get(Mnemonics[`${t}x`])).toBeInstanceOf(Word);
        expect(registers.get(Mnemonics[`${t}x`])).toEqual(new Word(exb[2], exb[3]));
        expect(registers.get(Mnemonics[`${t}h`])).toBeInstanceOf(Byte);
        expect(registers.get(Mnemonics[`${t}h`])).toEqual(new Byte(exb[2]));
        expect(registers.get(Mnemonics[`${t}l`])).toBeInstanceOf(Byte);
        expect(registers.get(Mnemonics[`${t}l`])).toEqual(new Byte(exb[3]));

        let x = new Word(random(Word));
        let xb = x.expand();

        registers.set(Mnemonics[`${t}x`], x);

        expect(registers.get(Mnemonics[`e${t}x`])).toEqual(new Double(exb[0], exb[1], xb[0], xb[1]));
        expect(registers.get(Mnemonics[`${t}x`])).toEqual(x);
        expect(registers.get(Mnemonics[`${t}h`])).toEqual(xb[0]);
        expect(registers.get(Mnemonics[`${t}l`])).toEqual(xb[1]);

        let h = new Byte(random(Byte));
        let l = new Byte(random(Byte));

        registers.set(Mnemonics[`${t}h`], h);
        registers.set(Mnemonics[`${t}l`], l);

        expect(registers.get(Mnemonics[`e${t}x`])).toEqual(new Double(exb[0], exb[1], h, l));
        expect(registers.get(Mnemonics[`${t}x`])).toEqual(new Word(h, l));
        expect(registers.get(Mnemonics[`${t}h`])).toEqual(h);
        expect(registers.get(Mnemonics[`${t}l`])).toEqual(l);
    }
});

test('Implements instruction pointer', () => {
    let ip = new Word(random(Word));
    registers.setIp(ip);
    expect(registers.getIp()).toEqual(ip);
});
