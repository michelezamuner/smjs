const DefinitionLoader = require('./DefinitionLoader');
const InstructionDependencies = require('./InstructionDependencies');
const Definition = require('./Definition');

module.exports = class InstructionSet {
    /**
     * @param {DefinitionLoader} loader
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

        const dependencies = definition.getDependencies()
            .map(dependency => this._dependencies[`get${dependency.name}`]());

        return new definition(...dependencies);
    }
};
