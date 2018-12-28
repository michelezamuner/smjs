module.exports = class AppConfig {
    /**
     * @param {string} architecture
     * @param {string} file
     */
    constructor(architecture, file) {
        this._architecture = architecture;
        this._file = file;
    }

    /**
     * @return {string}
     */
    getArchitecture() {
        return this._architecture;
    }

    /**
     * @return {string}
     */
    getFile() {
        return this._file;
    }
};
