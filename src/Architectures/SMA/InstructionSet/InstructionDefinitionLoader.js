module.exports = class InstructionDefinitionLoader {
    /**
     * @param {string} path
     */
    constructor(path) {
        this._path = path;
    }

    /**
     * @param {string} name
     * @return {function}
     */
    load(name) {
        return require(`${this._path}/${name}.js`);
    }
};
