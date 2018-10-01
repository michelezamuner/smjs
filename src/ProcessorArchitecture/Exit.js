const DataType = require('../DataTypes/DataType');

module.exports = class Exit {
    /**
     * @param {boolean=false} shouldExit
     * @param {null|DataType=null} exitStatus
     */
    constructor(shouldExit = false, exitStatus = null) {
        this._shouldExit = shouldExit;
        this._exitStatus = exitStatus;
    }

    /**
     * @returns {boolean}
     */
    shouldExit() {
        return this._shouldExit;
    }

    /**
     * @returns {null|DataType}
     */
    getExitStatus() {
        return this._exitStatus;
    }
};
