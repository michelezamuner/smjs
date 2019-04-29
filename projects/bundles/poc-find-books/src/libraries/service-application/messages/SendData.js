const _package = 'FindBooks.ServiceApplication.Messages.';

module.exports = class SendData {
    static toString() { return _package + SendData.name; }

    /**
     * @param {string} data
     */
    constructor(data) {
        this._data = data;
    }

    /**
     * @return {string}
     */
    getData() {
        return this._data;
    }
};
