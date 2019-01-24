/**
 * Thrown when trying to load a program with an invalid reference.
 */
module.exports = class InvalidProgramException extends Error {
    /**
     * @param {string} programReference
     */
    constructor(programReference) {
        super();
        this._programReference = programReference;
    }

    /**
     * @return {string}
     */
    getProgramReference() {
        return this._programReference;
    }
};
