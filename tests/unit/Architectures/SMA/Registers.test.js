const ControlRegisters = require('../../../../src/ProcessorInterfaces/Registers');
const Registers = require('../../../../src/Architectures/SMA/Registers');
const Mnemonics = require('../../../../src/Architectures/SMA/Mnemonics');
const Word = require('../../../../src/DataTypes/Word');
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

test('Implements main registers', () => {
    const eax = new Word(random(Word));
    const ebx = new Word(random(Word));
    const ecx = new Word(random(Word));
    const edx = new Word(random(Word));

    registers.set(Mnemonics.eax, eax);
    registers.set(Mnemonics.ebx, ebx);
    registers.set(Mnemonics.ecx, ecx);
    registers.set(Mnemonics.edx, edx);

    expect(registers.get(Mnemonics.eax)).toEqual(eax);
    expect(registers.get(Mnemonics.ebx)).toEqual(ebx);
    expect(registers.get(Mnemonics.ecx)).toEqual(ecx);
    expect(registers.get(Mnemonics.edx)).toEqual(edx);
});

test('Implements instruction pointer', () => {
    let ip = new Word(random(Word));
    registers.setIp(ip);
    expect(registers.getIp()).toEqual(ip);
});
