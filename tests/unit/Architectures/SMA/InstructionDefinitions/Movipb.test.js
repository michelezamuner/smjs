const Movipb = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Movipb');
const Word = require('../../../../../src/DataTypes/Word');
const random = require('../../../random');
const Register = require('../../../../../src/Architectures/SMA/Mnemonics').register;
const RegisterAddress = require('../../../../../src/Architectures/SMA/RegisterAddress');

/**
 * @type {Object}
 */
const registers = {};

/**
 * @type {Object}
 */
const memory = {};

/**
 * @type {Object}
 */
const provider = {};

/**
 * @type {null|Movipb}
 */
let definition = null;

beforeEach(() => {
    memory.write = jest.fn();
    provider.getRegisters = () => registers;
    provider.getMemory = () => memory;
    definition = new Movipb(provider);
});

test('implements move immediate to byte register pointer', () => {
    const value = new Word(random(Word));
    const bytes = value.expand();
    const address = new Word(random(Word));

    registers.get = reg => reg.eq(new RegisterAddress(Register.ax)) ? address : null;

    definition.exec(Register.ax, ...bytes);

    expect(memory.write.mock.calls[0][0]).toStrictEqual(address);
    expect(memory.write.mock.calls[0][1]).toStrictEqual(bytes[1]);
});

test('fails if size mismatch on move immediate to byte register pointer', () => {
    const forbidden = ['ah', 'al', 'eax', 'bh', 'bl', 'ebx', 'ch', 'cl', 'ecx', 'dh', 'dl', 'edx'];
    for (const register of forbidden) {
        const value = new Word(random(Word));
        expect(() => definition.exec(Register[register], ...value.expand()))
            .toThrow(`Cannot use register ${new RegisterAddress(Register[register]).format()} as pointer`);
    }
});
