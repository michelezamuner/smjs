const Registers = require('../../../src/Registers/Registers');
const Byte = require('../../../src/DataTypes/Byte');
const Word = require('../../../src/DataTypes/Word');
const Double = require('../../../src/DataTypes/Double');
const random = require('../random');

/**
 * @type {null|Registers}
 */
let registers = null;

beforeEach(() => {
    registers = new Registers({
        eax: Word,
        ebx: Word,
        et: Byte
    });
});

test('defines registers addresses and initializes them at zero', () => {
    expect(registers.eax instanceof Byte).toBe(true);
    expect(registers.ebx instanceof Byte).toBe(true);
    expect(registers.et instanceof Byte).toBe(true);

    expect(registers.eax).not.toEqual(registers.ebx);
    expect(registers.eax).not.toEqual(registers.et);
    expect(registers.ebx).not.toEqual(registers.et);
});

test('initializes defined registers to zero', () => {
    expect(registers.get(registers.eax)).toEqual(new Word(0x00));
    expect(registers.get(registers.ebx)).toEqual(new Word(0x00));
    expect(registers.get(registers.et)).toEqual(new Byte(0x00));
});

test('fails if trying to get undefined register', () => {
    const register = random(Byte, 3);
    expect(() => registers.get(new Byte(register))).toThrow(`No register exists at address ${register}`);
});

test('sets registers', () => {
    let value = new Word(random(Word));
    registers.set(registers.eax, value);
    expect(registers.get(registers.eax)).toEqual(value);

    value = new Word(random(Word));
    registers.set(registers.ebx, value);
    expect(registers.get(registers.ebx)).toEqual(value);

    value = new Byte(random(Byte));
    registers.set(registers.et, value);
    expect(registers.get(registers.et)).toEqual(value);
});

test('fails if setting invalid register', () => {
    const register = random(Byte, 3);
    expect(() => registers.set(new Byte(register), new Byte(0x00))).toThrow(`No register exists at address ${register}`);
});

test('fails if setting register with wrong sized value', () => {
    expect(() => registers.set(registers.eax, new Byte(random(Byte)))).toThrow('Invalid size of register value.');
    expect(() => registers.set(registers.ebx, new Double(random(Double)))).toThrow('Invalid size of register value.');
    expect(() => registers.set(registers.et, new Word(random(Word)))).toThrow('Invalid size of register value.');
});
