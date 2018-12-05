const Definition = require('../InstructionSet/Definition');
const Registers = require('../Registers');
const Memory = require('../../../ProcessorInterfaces/Memory');
const RegisterAddress = require('../RegisterAddress');
const Byte = require('../../../DataTypes/Byte');
const Word = require('../../../DataTypes/Word');
const Double = require('../../../DataTypes/Double');

/**
 * @implements Definition
 */
module.exports = class Movipd extends Definition {
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
        const bytes = value.cast(Double).expand();
        for (let i = 0; i < bytes.length; i++) {
            this._memory.write(address.add(new Byte(i)), bytes[i]);
        }
    }
};
