const TimeProvider = require('./TimeProvider');

module.exports = class Logger_SimpleTimeProvider extends TimeProvider {
    /**
     * @override
     */
    now() {
        return new Date();
    }
};
