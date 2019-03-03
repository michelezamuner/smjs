const TimeProvider = require('./TimeProvider');

module.exports = class SimpleTimeProvider extends TimeProvider {
    /**
     * @override
     */
    now() {
        return new Date();
    }
};
