module.exports = class Input {
    /**
     * @param {string} identifier
     * @param {string} representation
     * @param {Object} parameters
     */
    constructor(identifier, representation, parameters) {
        this._identifier = identifier;
        this._representation = representation;
        this._parameters = parameters;
    }

    /**
     * @return {string}
     */
    getIdentifier() {
        return this._identifier;
    }

    /**
     * @return {string}
     */
    getRepresentation() {
        return this._representation;
    }

    /**
     * @param {string} parameter
     * @return {string|undefined}
     */
    getParameter(parameter) {
        return this._parameters[parameter];
    }
};
