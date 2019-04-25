const _package = 'SlothMachine.SlothMachine.Config.Providers.';

/**
 * @interface
 */
module.exports = class Provider {
    static toString() { return _package + Provider.name; }

    constructor() {
        if (new.target === Provider) {
            throw 'Cannot instantiate interface';
        }
    }

    register() {
        throw 'Not implemented';
    }
};
