module.exports = class Request {
    /**
     * @param {string} architecture
     */
    constructor(architecture) {
        this._architecture = architecture;
    }

    /**
     * @return {string}
     */
    getArchitecture() {
        return this._architecture;
    }
};
