const Definition = require('../InstructionSet/Definition');
const Registers = require('../Registers');
const RegisterAddress = require('../RegisterAddress');

/**
 * @implements Definition
 */
module.exports = class Mov extends Definition {
    /**
     * @inheritDoc
     */
    static getDependencies() {
        return [Registers];
    }

    /**
     * @param {Registers} registers
     */
    constructor(registers) {
        super();
        this._registers = registers;
    }

    /**
     * @inheritDoc
     */
    exec(byte2, byte3, byte4) {
        const target = new RegisterAddress(byte2);
        const source = new RegisterAddress(byte3);

        if (target.getType() !== source.getType()) {
            throw `Cannot move register ${source} to register ${target}`;
        }
        this._registers.set(target, this._registers.get(source));
    }
};
