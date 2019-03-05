/**
 * Thrown when the module that is being loaded is not a valid architecture.
 */
module.exports = class ArchitectureLoader_InvalidArchitectureException extends Error {
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
