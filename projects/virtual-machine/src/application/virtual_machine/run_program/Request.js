/**
 * @interface
 */
module.exports = class Request {
    constructor() {
        if (new.target === Request) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @return {string}
     */
    getArchitectureName() {
        throw 'Not implemented'
    }

    /**
     * @return {string}
     */
    getProgramReference() {
        throw 'Not implemented'
    }
};
