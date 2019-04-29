const _package = 'FindBooks.ServiceApplication.Messages.';

module.exports = class SendResponse {
    static toString() { return _package + SendResponse.name; }

    /**
     * @param {string} response
     */
    constructor(response) {
        this._response = response;
    }

    /**
     * @return {string}
     */
    getResponse() {
        return this._response;
    }
};
