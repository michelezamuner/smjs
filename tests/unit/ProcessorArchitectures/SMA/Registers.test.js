const ControlRegisters = require('../../../../src/ProcessorProtocol/ControlRegisters');
const Registers = require('../../../../src/ProcessorArchitectures/SMA/Registers');
const Byte = require('../../../../src/DataTypes/Byte');
const Word = require('../../../../src/DataTypes/Word');
const random = require('../../random');

/**
 * @type {Object}
 */
const delegate = {};

/**
 * @type {Registers}
 */
let registers = null;

beforeEach(() => {
    const factory = {
        create: () => delegate,
    };

    delegate.eax = new Byte(0x00);
    delegate.ebx = new Byte(0x01);
    delegate.ecx = new Byte(0x02);
    delegate.edx = new Byte(0x03);
    delegate.ip = new Byte(0x04);
    delegate.set = jest.fn();

    registers = new Registers(factory);
});

test('Implements control registers', () => {
    expect(registers instanceof ControlRegisters).toBe(true);
});

test('Defines main registers and exposes their addresses', () => {
    expect(registers.eax).toBeDefined();
    expect(registers.ebx).toBeDefined();
    expect(registers.ecx).toBeDefined();
    expect(registers.edx).toBeDefined();
});

test('Implements main registers', () => {
    const eax = new Word(random(Word));
    delegate.get = jest.fn(() => eax);
    expect(registers.get(registers.eax)).toEqual(eax);
    expect(delegate.get).toBeCalledWith(registers.eax);
    registers.set(registers.eax, eax);
    expect(delegate.set).toBeCalledWith(registers.eax, eax);

    const ebx = new Word(random(Word));
    delegate.get = jest.fn(() => ebx);
    expect(registers.get(registers.ebx)).toEqual(ebx);
    expect(delegate.get).toBeCalledWith(registers.ebx);
    registers.set(registers.ebx, ebx);
    expect(delegate.set).toBeCalledWith(registers.ebx, ebx);

    const ecx = new Word(random(Word));
    delegate.get = jest.fn(() => ecx);
    expect(registers.get(registers.ecx)).toEqual(ecx);
    expect(delegate.get).toBeCalledWith(registers.ecx);
    registers.set(registers.ecx, ecx);
    expect(delegate.set).toBeCalledWith(registers.ecx, ecx);

    const edx = new Word(random(Word));
    delegate.get = jest.fn(() => edx);
    expect(registers.get(registers.edx)).toEqual(edx);
    expect(delegate.get).toBeCalledWith(registers.edx);
    registers.set(registers.edx, edx);
    expect(delegate.set).toBeCalledWith(registers.edx, edx);
});

test('Implements instruction pointer', () => {
    let ip = new Word(random(Word));
    delegate.get = jest.fn(() => ip);
    expect(registers.getIp()).toEqual(ip);
    expect(delegate.get).toBeCalledWith(delegate.ip);

    ip = new Word(random(Word));
    registers.setIp(ip);
    expect(delegate.set).toBeCalledWith(delegate.ip, ip);
});
