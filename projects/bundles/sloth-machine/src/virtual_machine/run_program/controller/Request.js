const _package = 'SlothMachine.SlothMachine.VirtualMachine.RunProgram.Controller.';

const RequestInterface = require('app/virtual-machine').run_program.Request;

module.exports = class Request extends RequestInterface {
    static toString() { return _package + Request.name; }

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
