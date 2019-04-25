const _package = 'SlothMachine.VirtualMachine.RunProgram.Messages.';

const Architecture = require('domain/sloth-machine-framework').architecture.Architecture;

module.exports = class ArchitectureLoaded {
    static toString() { return _package + ArchitectureLoaded.name; }

    /**
     * @param {Architecture} architecture
     * @param {string} name
     */
    constructor(architecture, name) {
        this._architecture = architecture;
        this._name = name;
    }

    /**
     * @return {string}
     */
    getArchitectureName() {
        return this._name;
    }

    /**
     * @return {Architecture}
     */
    getArchitecture() {
        return this._architecture;
    }
};
