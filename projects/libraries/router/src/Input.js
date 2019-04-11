module.exports = class Router_Input {
    /**
     * @param {string} identifier
     * @param {Object} parameters
     */
    constructor(identifier, parameters) {
        this._identifier = identifier;
        this._parameters = parameters;
    }

    /**
     * @return {string}
     */
    getIdentifier() {
        return this._identifier;
    }

    /**
     * @param {string} parameter
     * @return {string|undefined}
     */
    getParameter(parameter) {
        return this._parameters[parameter];
    }
};
