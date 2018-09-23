const Registers = require('../../../src/Processor/Registers');
const Byte = require('../../../src/Processor/DataTypes/Byte');

/**
 * @type {null|Registers}
 */
let registers = null;

beforeEach(() => {
    registers = new Registers;
});

test('sets main registers as bytes', () => {
    Registers.MAIN_REGISTERS.forEach(register => {
        const value = Math.floor(Math.random() * 10);
        registers.setMain(register, value);
        expect(registers.getMain(register)).toEqual(new Byte(value));
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
    const value = Math.floor(Math.random() * 10);

    registers.ip = value;

    expect(registers.ip).toBe(value);
});

test('fails if setting non numeric instruction pointer', () => {
    const value = 'non numeric value';

    expect(() => registers.ip = value).toThrow(`Invalid instruction pointer ${value}`)
});

test('fails if setting negative instruction pointer', () => {
    const value = -1 * Math.floor(Math.random() * 10);

    expect(() => registers.ip = value).toThrow(`Invalid instruction pointer ${value}`);
});

test('sets status registers', () => {
    Registers.STATUS_REGISTERS.forEach(register => {
        const value = Math.floor(Math.random() * 10);

        registers.setStatus(register, value);
        expect(registers.getStatus(register)).toBe(value);
    });
});

test('status registers are converted to integer if possible', () => {
    Registers.STATUS_REGISTERS.forEach(register => {
        const value = Math.floor(Math.random() * 10);

        registers.setStatus(register, '' + value);
        expect(registers.getStatus(register)).toBe(value);
    });
});

test('status registers convert bytes to integers', () => {
    Registers.STATUS_REGISTERS.forEach(register => {
        const value = Math.floor(Math.random() * 10);

        registers.setStatus(register, new Byte(value));
        expect(registers.getStatus(register)).toBe(value);
    });
});

test('fails if setting non integer status register', () => {
    Registers.STATUS_REGISTERS.forEach(register => {
        ['non integer value', 1.454].forEach(value => {
            expect(() => registers.setStatus(register, value))
                .toThrow(`Status register must be integer, got '${value}' instead`);
        });
    });
});

test('fails if setting or getting wrong status register', () => {
    const register = 'invalid';

    expect(() => registers.setStatus(register, 10)).toThrow(`Invalid status register '${register}'`);
    expect(() => registers.getStatus(register)).toThrow(`Invalid status register '${register}'`);
});
