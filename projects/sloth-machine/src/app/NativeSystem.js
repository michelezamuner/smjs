const System = require('./System');

module.exports = class NativeSystem extends System {
    /**
     * @inheritDoc
     */
    exit(text, exitStatus = 0) {
        if (exitStatus > 0) {
            console.error(text);
        } else {
            console.log(text);
        }
        process.exit(exitStatus);
    }
};
