const _package = 'SlothMachine.ArchitectureLoader.';

/**
 * Thrown when the module that is being loaded is not a valid architecture.
 */
module.exports = class InvalidArchitectureException extends Error {
    static toString() { return _package + InvalidArchitectureException.name; }

    /**
     * @param {string} architectureName
     */
    constructor(architectureName) {
        super(`Architecture "${architectureName}" is invalid`);
        this._architectureName = architectureName;
    }

    /**
     * @return {string}
     */
    getArchitectureName() {
        return this._architectureName;
    }
};
