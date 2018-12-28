module.exports = class Request {
    /**
     * @param {string|null} architecture
     */
    constructor(architecture) {
        this._architecture = architecture;
    }

    /**
     * @return {string|null}
     */
    getArchitecture() {
        return this._architecture;
    }
};
