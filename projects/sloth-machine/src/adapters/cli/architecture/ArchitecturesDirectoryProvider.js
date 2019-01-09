module.exports = class ArchitecturesDirectoryProvider {
    /**
     * @param {string} directory
     */
    constructor(directory) {
        this._directory = directory;
    }

    /**
     * @return {string}
     */
    getDirectory() {
        return this._directory;
    }
};
