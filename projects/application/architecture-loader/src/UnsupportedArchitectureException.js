/**
 * Thrown when trying to load an architecture that is not supported.
 */
module.exports = class ArchitectureLoader_UnsupportedArchitectureException extends Error {
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
