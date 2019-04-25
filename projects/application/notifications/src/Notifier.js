const _package = 'SlothMachine.Notifications.';

/**
 * @interface
 */
module.exports = class Notifier {
    static toString() { return _package + Notifier.name; }

    constructor() {
        if (new.target === Notifier) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {Object} message
     */
    notify(message) {
        throw 'Not implemented';
    }
};
