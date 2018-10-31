const Definition = require('../InstructionSet/Definition');
const Registers = require('../Registers');
const Memory = require('../../../ProcessorInterfaces/Memory');
const RegisterAddress = require('../RegisterAddress');
const Word = require('../../../DataTypes/Word');
const Byte = require('../../../DataTypes/Byte');

/**
 * @implements Definition
 */
module.exports = class Movipw extends Definition {
    /**
     * @inheritDoc
     */
    static getDependencies() {
        return [Registers, Memory];
    }

    /**
     * @param {Registers} registers
     * @param {Memory} memory
     */
    constructor(registers, memory) {
        super();
        this._registers = registers;
        this._memory = memory;
    }

    /**
     * @inheritDoc
     */
    exec(byte2, byte3, byte4) {
        const register = new RegisterAddress(byte2);
        const value = new Word(byte3, byte4);

        if (!register.isHalf()) {
            throw `Cannot use register ${register} as pointer`;
        }
        const address = this._registers.get(register);
        const bytes = value.expand();
        this._memory.write(address, bytes[0]);
        this._memory.write(address.add(new Byte(0x01)), bytes[1]);
    }
};
