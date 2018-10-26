const Definition = require('../InstructionSet/Definition');
const RegistersProvider = require('../InstructionSet/RegistersProvider');
const RegisterAddress = require('../RegisterAddress');

/**
 * @implements Definition
 */
module.exports = class Mov extends Definition {
    /**
     * @param {RegistersProvider} provider
     */
    constructor(provider) {
        super();
        this._registers = provider.getRegisters();
    }

    /**
     * @inheritDoc
     */
    exec(byte2, byte3, byte4) {
        const target = new RegisterAddress(byte2);
        const source = new RegisterAddress(byte3);

        if (target.getType() !== source.getType()) {
            throw `Cannot move register ${source.format()} to register ${target.format()}`;
        }
        this._registers.set(target, this._registers.get(source));
    }
};
