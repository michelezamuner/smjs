/**
 * @interface
 */
module.exports = class Notifications_Notifier {
    constructor() {
        if (new.target === Notifications_Notifier) {
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
