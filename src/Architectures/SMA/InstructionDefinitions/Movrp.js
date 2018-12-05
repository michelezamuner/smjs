const Definition = require('../InstructionSet/Definition');
const Registers = require('../Registers');
const Memory = require('../../../ProcessorInterfaces/Memory');
const RegisterAddress = require('../RegisterAddress');

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
            throw `Cannot use register ${target} as pointer`;
        }
        this._memory.write(this._registers.get(target), this._registers.get(source));
    }
};
