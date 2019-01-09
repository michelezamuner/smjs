const ArchitectureInterface = require('core').Architecture;
const Loader = require('core').ProgramLoader;

module.exports = {
    Architecture: class Architecture extends ArchitectureInterface {
        /**
         * @param {Loader} loader
         */
        constructor(loader) {
            super();
            this._interpreter = {};
            this._loader = loader;
        }

        /**
         * @inheritDoc
         */
        getInterpreter() {
            return this._interpreter;
        }

        /**
         * @inheritDoc
         */
        getLoader() {
            return this._loader;
        }
    }
};
