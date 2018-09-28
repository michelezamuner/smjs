const ControlRegisters = require('../../../src/ProcessorArchitecture/ControlRegisters');
const Registers = require('../../../src/Interpreter/Registers');
const Word = require('../../../src/Processor/DataTypes/Word');
const Double = require('../../../src/Processor/DataTypes/Double');

/**
 * @type {Registers}
 */
let registers = null;

beforeEach(() => {
    registers = new Registers;
});

/**
 * @param {DataType} dataType
 * @returns {DataType}
 */
function random(dataType) {
    return new dataType(Math.floor(Math.random() * dataType.MAX));
}

test('Implements control registers', () => {
    expect(registers instanceof ControlRegisters).toBe(true);
});

test('Defines instruction size', () => {
    expect(registers.getIs()).toBe(4);
});

test('Implements main registers', () => {
    expect(registers.get(registers.eax)).toEqual(new Word(0x0000));
    const eax = random(Word);
    registers.set(registers.eax, eax);
    expect(registers.get(registers.eax)).toEqual(eax);

    expect(registers.get(registers.ebx)).toEqual(new Word(0x0000));
    const ebx = random(Word);
    registers.set(registers.ebx, ebx);
    expect(registers.get(registers.ebx)).toEqual(ebx);

    expect(registers.get(registers.ecx)).toEqual(new Word(0x0000));
    const ecx = random(Word);
    registers.set(registers.ecx, ecx);
    expect(registers.get(registers.ecx)).toEqual(ecx);

    expect(registers.get(registers.edx)).toEqual(new Word(0x0000));
    const edx = random(Word);
    registers.set(registers.edx, edx);
    expect(registers.get(registers.edx)).toEqual(edx);
});

test('Implements instruction registers', () => {
    expect(registers.getIp()).toEqual(new Word(0x0000));

    registers.incrementIp();
    expect(registers.getIp()).toEqual(new Word(0x0004));
    registers.incrementIp();
    expect(registers.getIp()).toEqual(new Word(0x0008));

    const ip = random(Word);
    registers.setIp(ip);
    expect(registers.getIp()).toEqual(ip);

    const ir = random(Double);
    registers.setIr(ir);
    expect(registers.getIr()).toEqual(ir);
});

test('implements exit registers', () => {
    expect(registers.shouldExit()).toBe(false);
    registers.setExit();
    expect(registers.shouldExit()).toBe(true);

    expect(registers.getEs()).toEqual(new Word(0x00));
    const es = random(Word);
    registers.setEs(es);
    expect(registers.getEs()).toEqual(es);
});
