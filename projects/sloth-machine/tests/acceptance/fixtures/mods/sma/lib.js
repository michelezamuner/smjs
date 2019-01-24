const ArchitectureInterface = require('framework').Architecture;

module.exports = class Architecture extends ArchitectureInterface {
    /**
     * @inheritDoc
     */
    getInterpreter(system) {
        return {};
    }
};
