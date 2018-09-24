const Registers = require('../../../src/Processor/Registers');
const Byte = require('../../../src/Processor/DataTypes/Byte');

/**
 * @type {null|Registers}
 */
let registers = null;

/**
 * @type {null|number}
 */
let random = null;

beforeEach(() => {
    registers = new Registers;
    random = Math.floor(Math.random() * 10);
});

test('sets main registers', () => {
    Registers.MAIN_REGISTERS.forEach(register => {
        registers.setMain(register, random);
        expect(registers.getMain(register)).toEqual(new Byte(random));
    });
});

test('fails if setting or getting wrong main register', () => {
    const register = 'invalid';

    expect(() => registers.setMain(register, 10)).toThrow(`Invalid main register '${register}'`);
    expect(() => registers.getMain(register)).toThrow(`Invalid main register '${register}'`);
});

test('instruction pointer starts at zero', () => {
    expect(registers.ip).toBe(0);
});

test('sets instruction pointer', () => {
    registers.ip = random;
    expect(registers.ip).toBe(random);
});

test('fails if setting non numeric instruction pointer', () => {
    const value = 'non numeric value';
    expect(() => registers.ip = value).toThrow(`Invalid instruction pointer ${value}`)
});

test('fails if setting negative instruction pointer', () => {
    const value = -1 * random;
    expect(() => registers.ip = value).toThrow(`Invalid instruction pointer ${value}`);
});

test('handles exit trigger', () => {
    const setSpy = jest.spyOn(registers, 'et', 'set');
    const getSpy = jest.spyOn(registers, 'et', 'get');

    registers.et = new Byte(1);

    expect(setSpy).toHaveBeenCalled();
    expect(registers.et).toEqual(new Byte(1));
    expect(getSpy).toHaveBeenCalled();
});

test('handles exit status', () => {
    const setSpy = jest.spyOn(registers, 'es', 'set');
    const getSpy = jest.spyOn(registers, 'es', 'get');

    registers.es = new Byte(random);

    expect(setSpy).toHaveBeenCalled();
    expect(registers.es).toEqual(new Byte(random));
    expect(getSpy).toHaveBeenCalled();
});

test('fails if exit trigger is set to non-byte', () => {
    expect(() => registers.et = random).toThrow(`Exit trigger register must be set to byte, got ${random} instead`);
});

test('fails if exit status is set to non-byte', () => {
    expect(() => registers.es = random).toThrow(`Exit status register must be set to byte, got ${random} instead`);
});
