const _package = 'Logger.';

const TimeProvider = require('./TimeProvider');

module.exports = class SimpleTimeProvider extends TimeProvider {
    static toString() { return _package + SimpleTimeProvider.name; }

    /**
     * @override
     */
    now() {
        return new Date();
    }
};
