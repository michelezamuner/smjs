const Response = require('./Response');

/**
 * @interface
 */
module.exports = class ApiGateway_Application_ApiGateway_SearchBooks_Presenter {
    constructor() {
        if (new.target === ApiGateway_Application_ApiGateway_SearchBooks_Presenter) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {Response} response
     */
    present(response) {
        throw 'Not implemented';
    }
};
