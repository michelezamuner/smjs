const InstructionDefinitionLoader = require('./InstructionDefinitionLoader');
const InstructionDependencies = require('./InstructionDependencies');
const Definition = require('./Definition');

module.exports = class InstructionSet {
    /**
     * @param {InstructionDefinitionLoader} loader
     * @param {InstructionDependencies} dependencies
     */
    constructor(loader, dependencies) {
        this._loader = loader;
        this._dependencies = dependencies;
    }

    /**
     * @param {string} opcode
     * @return {Definition}
     */
    get(opcode) {
        const definition = this._loader.load(opcode);

        return new definition(this._dependencies);
    }
};
