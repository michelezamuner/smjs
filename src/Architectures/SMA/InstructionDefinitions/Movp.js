const Definition = require('../InstructionSet/Definition');
const Registers = require('../Registers');
const Memory = require('../../../ProcessorInterfaces/Memory');
const RegisterAddress = require('../RegisterAddress');
const Byte = require('../../../DataTypes/Byte');

/**
 * @implements Definition
 */
module.exports = class Movp extends Definition {
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
        const dest = new RegisterAddress(byte2);
        const source = new RegisterAddress(byte3);

        if (!source.isHalf()) {
            throw `Cannot use register ${source.format()} as pointer`;
        }

        const addr = this._registers.get(source);
        const type = dest.getType();
        const value = this._memory.readSet(addr, new Byte(type.SIZE));
        this._registers.set(dest, new type(...value));
    }
};
