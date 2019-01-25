const Architecture = require('sloth-machine-framework').Architecture;

module.exports = new class extends Architecture {
    /**
     * @inheritDoc
     */
    getInterpreter(system) {
        return {};
    }
};
