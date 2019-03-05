const RequestInterface = require('app/virtual-machine').run_program.Request;

module.exports = class SlothMachine_VirtualMachine_RunProgram_Controller_Request extends RequestInterface {
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
