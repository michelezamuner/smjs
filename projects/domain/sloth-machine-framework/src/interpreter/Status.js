const Address = require('../data/Address');
const ExitStatus = require('./ExitStatus');

module.exports = class Status {
    /**
     * @param {Address|null} jumpAddress
     * @param {ExitStatus|null} exitStatus
     */
    constructor(jumpAddress = null, exitStatus = null) {
        this._jumpAddress = jumpAddress;
        this._exitStatus = exitStatus;
    }

    /**
     * @return {boolean}
     */
    shouldJump() {
        return !!this._jumpAddress;
    }

    /**
     * @return {boolean}
     */
    shouldExit() {
        return !!this._exitStatus;
    }

    /**
     * @return {Address}
     */
    getJumpAddress() {
        if (!this.shouldJump()) {
            throw 'Trying to get jump address when program is not jumping';
        }

        return this._jumpAddress;
    }

    /**
     * @return {ExitStatus}
     */
    getExitStatus() {
        if (!this.shouldExit()) {
            throw 'Trying to get exit status when program is not exiting';
        }

        return this._exitStatus;
    }
};