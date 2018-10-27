const Definition = require('../InstructionSet/Definition');
const Registers = require('../Registers');
const Memory = require('../../../ProcessorInterfaces/Memory');
const RegisterAddress = require('../RegisterAddress');
const Byte = require('../../../DataTypes/Byte');

/**
 * @implements Definition
 */
module.exports = class Movrp extends Definition {
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
        const target = new RegisterAddress(byte2);
        const source = new RegisterAddress(byte3);

        if (!target.isHalf()) {
            throw `Cannot use register ${target.format()} as pointer`;
        }

        const bytes = this._registers.get(source).expand();
        const type = source.getType();
        const actual = this._registers.get(target);
        for (let i = 0; i < type.SIZE; i++) {
            this._memory.write(actual.add(new Byte(i)), bytes[i]);
        }
    }
};
