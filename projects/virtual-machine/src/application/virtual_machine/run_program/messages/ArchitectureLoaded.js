const Architecture = require('sloth-machine-framework').Architecture;

module.exports = class ArchitectureLoaded {
    /**
     * @param {Architecture} architecture
     */
    constructor(architecture) {
        this._architecture = architecture;
    }

    /**
     * @return {Architecture}
     */
    getArchitecture() {
        return this._architecture;
    }
};
