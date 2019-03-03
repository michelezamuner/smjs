const Architecture = require('sloth-machine-framework').Architecture;

module.exports = class ArchitectureLoaded {
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
