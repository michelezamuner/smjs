const _package = 'Router.';

module.exports = class Request {
    static toString() { return _package + Request.name; }

    /**
     * @param {string} path
     * @param {Object} params
     * @param {Object} meta
     */
    constructor(path, params, meta) {
        this._path = path;
        this._params = params;
        this._meta = meta;
    }

    /**
     * @return {string}
     */
    getPath() {
        return this._path;
    }

    /**
     * @param {string} name
     * @return {string|null}
     */
    getParam(name) {
        return this._params[name] || null;
    }

    /**
     * @param {string} name
     * @return {string|null}
     */
    getMeta(name) {
        return this._meta[name] || null;
    }
};
