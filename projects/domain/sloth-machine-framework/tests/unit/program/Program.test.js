const Program = require('../../../src/program/Program');
const DataUnit = require('../../../src/data/DataUnit');
const Data = require('../../../src/data/Data');
const Address = require('../../../src/data/Address');
const Size = require('../../../src/data/Size');
const InvalidAddressException = require('../../../src/program/InvalidAddressException');
const ReadOutOfBoundsException = require('../../../src/program/ReadOutOfBoundsException');

const data = new Data([
    new DataUnit(0x00), new DataUnit(0x01), new DataUnit(0x02), new DataUnit(0x03),
    new DataUnit(0x10), new DataUnit(0x11), new DataUnit(0x12),
    new DataUnit(0x20),
    new DataUnit(0x30), new DataUnit(0x31),
    // test reading empty size here
]);

const program = new Program(data);

test('can read chunks of data of given size at given address', () => {
    const reads = [
        {
            addr: new Address(0),
            size: new Size(4),
            exp: [new DataUnit(0x00), new DataUnit(0x01), new DataUnit(0x02), new DataUnit(0x03)]
        },
        {
            addr: new Address(4),
            size: new Size(3),
            exp: [new DataUnit(0x10), new DataUnit(0x11), new DataUnit(0x12)]
        },
        {
            addr: new Address(7),
            size: new Size(1),
            exp: [new DataUnit(0x20)]
        },
        {
            addr: new Address(8),
            size: new Size(2),
            exp: [new DataUnit(0x30), new DataUnit(0x31)]
        },
        {
            addr: new Address(10),
            size: new Size(0),
            exp: [],
        }
    ];

    for (const read of reads) {
        expect(program.read(read.addr, read.size)).toStrictEqual(new Data(read.exp));
    }
});

test('fails if invalid address', () => {
    const address = new Address(0xFF);

    expect(() => program.read(address, new Size(1))).toThrow(InvalidAddressException);
    expect(() => program.read(address, new Size(1))).toThrow(`Invalid address ${address.format()}`);
});

test('fails if read out of bounds', () => {
    const address = new Address(6);
    const size = new Size(5);

    expect(() => program.read(address, size)).toThrow(ReadOutOfBoundsException);
    expect(() => program.read(address, size))
        .toThrow(`Out of bounds read of ${size.format()} units at address ${address.format()}`);
});
