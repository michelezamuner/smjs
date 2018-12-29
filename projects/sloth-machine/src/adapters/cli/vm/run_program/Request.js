const RequestInterface = require('core').Request;

module.exports = class Request extends RequestInterface {
    /**
     * @param {string|null} architecture
     */
    constructor(architecture) {
        super();
        this._architecture = architecture;
    }

    /**
     * @return {string|null}
     */
    getArchitecture() {
        return this._architecture;
    }
};
