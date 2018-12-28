/**
 * Thrown when trying to create an interpreter with an unsupported architecture.
 */
module.exports = class UnsupportedArchitectureException extends Error {
    /**
     * @param {string} architecture
     */
    constructor(architecture) {
        super();
        this._architecture = architecture;
    }

    /**
     * @return {string}
     */
    getArchitecture() {
        return this._architecture;
    }
};
