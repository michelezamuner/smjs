/**
 * @interface
 */
module.exports = class SlothMachine_Providers_Provider {
    constructor() {
        if (new.target === SlothMachine_Providers_Provider) {
            throw 'Cannot instantiate interface';
        }
    }

    register() {
        throw 'Not implemented';
    }
};
