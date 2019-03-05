const Architecture = require('domain/sloth-machine-framework').architecture.Architecture;

module.exports = class VirtualMachine_RunProgram_Messages_ArchitectureLoaded {
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
