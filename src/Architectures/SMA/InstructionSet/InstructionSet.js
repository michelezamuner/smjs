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
     * @param {string} instructionName
     * @return {Definition}
     */
    get(instructionName) {
        const definition = this._loader.load(this._capitalize(instructionName));
        const dependencies = definition.getDependencies()
            .map(dependency => this._dependencies[`get${dependency.name}`]());

        return new definition(...dependencies);
    }

    /**
     * @param {string} string
     * @return {string}
     * @private
     */
    _capitalize(string) {
        const first = string[0];
        return first.toUpperCase() + string.slice(1);
    }
};
