/**
 * @interface
 */
module.exports = class Provider {
    constructor() {
        if (new.target === Provider) {
            throw 'Cannot instantiate interface';
        }
    }

    register() {
        throw 'Not implemented';
    }
};
