const Movrmp = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Movrmp');
const Byte = require('../../../../../src/DataTypes/Byte');
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
 * @type {null|Movrmp}
 */
let definition = null;

beforeEach(() => {
    provider.getRegisters = () => registers;
    provider.getMemory = () => memory;
    definition = new Movrmp(provider);
});

test('implements move register to memory pointer', () => {
    for (const register of [Register.ah, Register.ax, Register.eax]) {
        memory.write = jest.fn();
        const ptr = new Word(random(Word));
        const mem = new Word(random(Word));
        const type = new RegisterAddress(register).getType();
        const value = new type(random(type));
        const valueb = value.expand();

        registers.get = reg => reg.eq(new RegisterAddress(register)) ? value : null;
        memory.readSet = (addr, size) => addr.eq(ptr) && size.eq(new Byte(0x02)) ? mem.expand() : null;

        definition.exec(...ptr.expand(), register);

        for (let i = 0; i < type.SIZE; i++) {
            expect(memory.write.mock.calls[i][0]).toStrictEqual(mem.add(new Byte(i)));
            expect(memory.write.mock.calls[i][1]).toStrictEqual(valueb[i]);
        }
    }
});
