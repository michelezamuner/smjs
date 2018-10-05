const Memory = require('../../../src/Memory/Memory');
const MemoryInterface = require('../../../src/ProcessorInterfaces/Memory');
const Byte = require('../../../src/DataTypes/Byte');
const Word = require('../../../src/DataTypes/Word');
const Double = require('../../../src/DataTypes/Double');
const random = require('../random');

/**
 * @type {null|Memory}
 */
let memory = null;

/**
 * @type {Word}
 */
const max = new Word(0xFFFF);

beforeEach(() => {
    memory = new Memory(max);
});

test('implements memory interface', () => {
    expect(memory).toBeInstanceOf(MemoryInterface);
});

test('has max', () => {
    expect(memory.getMax()).toEqual(max);
});

test('reads zeros wherever nothing has been written', () => {
    for (const address of [0x0000, 0x1234, 0xFEDC]) {
        expect(memory.read(new Word(address))).toEqual(new Byte(0x00));
    }
});

test('writes and reads', () => {
    const address = new Word(random(Word));
    const value = new Byte(random(Byte));

    memory.write(address, value);
    expect(memory.read(address)).toEqual(value);
});

test('reads a set of bytes', () => {
    const offsetValue = random(Word);
    const offset = new Word(offsetValue < 4 ? offsetValue : offsetValue - 4);
    const bytes = [new Byte(random(Byte)), new Byte(random(Byte)), new Byte(random(Byte)), new Byte(random(Byte))];

    for (const address in bytes) {
        memory.write(new Word(offset.uint() + parseInt(address)), bytes[address]);
    }

    expect(memory.readSet(offset, new Byte(4))).toEqual(bytes);
});

test('fails if trying to read address outside of memory size', () => {
    for (const address of [0x10000, 0x124356, 0xFFFFFFFF]) {
        expect(() => memory.read(new Double(address)))
            .toThrow(`Address ${address} exceeds memory max (${max.uint()})`);
    }
});

test('fails if trying to read a set of bytes going outside of memory size', () => {
    expect(() => memory.readSet(new Double(0xFFFF), new Byte(2)))
        .toThrow(`Address ${0x10000} exceeds memory max (${max.uint()})`);
    expect(() => memory.readSet(new Double(0xFFFE), new Byte(3)))
        .toThrow(`Address ${0x10000} exceeds memory max (${max.uint()})`);
    expect(() => memory.readSet(new Double(0xFFFD), new Byte(4)))
        .toThrow(`Address ${0x10000} exceeds memory max (${max.uint()})`);
});

test('fails if trying to write to address outside of memory size', () => {
    for (const address of [0x10000, 0x124356, 0xFFFFFFFF]) {
        expect(() => memory.write(new Double(address), new Byte(0x00)))
            .toThrow(`Address ${address} exceeds memory max (${max.uint()})`);
    }
});

test('fails if trying to write non bytes', () => {
    expect(() => memory.write(new Word(0x00), new Word(random(Word))))
        .toThrow('Only single bytes can be written to memory');
    expect(() => memory.write(new Word(0x00), new Double(random(Word))))
        .toThrow('Only single bytes can be written to memory');
});
