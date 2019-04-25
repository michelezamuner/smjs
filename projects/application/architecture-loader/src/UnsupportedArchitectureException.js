const _package = 'SlothMachine.ArchitectureLoader.';

/**
 * Thrown when trying to load an architecture that is not supported.
 */
module.exports = class UnsupportedArchitectureException extends Error {
    static toString() { return _package + UnsupportedArchitectureException.name; }

    /**
     * @param {string} architectureName
     */
    constructor(architectureName) {
        super(`Architecture "${architectureName}" is not supported`);
        this._architectureName = architectureName;
    }

    /**
     * @return {string}
     */
    getArchitectureName() {
        return this._architectureName;
    }
};
