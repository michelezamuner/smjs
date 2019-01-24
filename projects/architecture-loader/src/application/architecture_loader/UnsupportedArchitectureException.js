/**
 * Thrown when trying to load an architecture that is not supported.
 */
module.exports = class UnsupportedArchitectureException extends Error {
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
