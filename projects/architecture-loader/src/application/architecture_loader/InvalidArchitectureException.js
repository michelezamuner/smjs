/**
 * Thrown when the module that is being loaded is not a valid architecture.
 */
module.exports = class InvalidArchitectureException extends Error {
    /**
     * @param {string} architectureName
     */
    constructor(architectureName) {
        super();
        this._architectureName = architectureName;
    }

    /**
     * @return {string}
     */
    getArchitectureName() {
        return this._architectureName;
    }
};
