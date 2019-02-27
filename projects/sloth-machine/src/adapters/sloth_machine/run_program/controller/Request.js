const RequestInterface = require('virtual-machine').Request;

module.exports = class Request extends RequestInterface {
    /**
     * @param {string} architectureName
     * @param {string} programReference
     */
    constructor(architectureName, programReference) {
        super();
        this._architectureName = architectureName;
        this._programReference = programReference;
    }

    /**
     * @override
     */
    getArchitectureName() {
        return this._architectureName;
    }

    /**
     * @override
     */
    getProgramReference() {
        return this._programReference;
    }
};
