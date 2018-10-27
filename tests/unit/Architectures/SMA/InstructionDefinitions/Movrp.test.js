const Movrp = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Movrp');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
const Memory = require('../../../../../src/ProcessorInterfaces/Memory');
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
 * @type {null|Movrp}
 */
let definition = null;

beforeEach(() => {
    definition = new Movrp(registers, memory);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Movrp.getDependencies()).toStrictEqual([Registers, Memory]);
});

test('implements move register to register pointer', () => {
    for (const register of [Register.ah, Register.ax, Register.eax]) {
        memory.write = jest.fn();
        const mem = new Word(random(Word));
        const type = new RegisterAddress(register).getType();
        const value = new type(random(type));
        const valueb = value.expand();

        registers.get = reg => {
            if (reg.eq(new RegisterAddress(register))) {
                return value;
            } else if (reg.eq(new RegisterAddress(Register.bx))) {
                return mem;
            }

            return null;
        };

        definition.exec(Register.bx, register, new Byte(0x00));

        for (let i = 0; i < type.SIZE; i++) {
            expect(memory.write.mock.calls[i][0]).toStrictEqual(mem.add(new Byte(i)));
            expect(memory.write.mock.calls[i][1]).toStrictEqual(valueb[i]);
        }
    }
});

test('fails if type mismatch on move register to register pointer', () => {
    const forbidden = [
        Register.ah, Register.al, Register.eax,
        Register.bh, Register.bl, Register.ebx,
        Register.ch, Register.cl, Register.ecx,
        Register.dh, Register.dl, Register.edx,
    ];
    for (const register of forbidden) {
        expect(() => definition.exec(register, Register.ah, new Byte(0x00)))
            .toThrow(`Cannot use register ${new RegisterAddress(register).format()} as pointer`)
    }
});
