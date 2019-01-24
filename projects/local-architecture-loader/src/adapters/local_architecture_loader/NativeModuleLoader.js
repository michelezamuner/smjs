const ModuleLoader = require('./ModuleLoader');
const ModuleLoaderException = require('./ModuleLoaderException');

module.exports = new class NativeModuleLoader extends ModuleLoader {
    /**
     * @inheritDoc
     */
    load(module) {
        try {
            return require(module);
        } catch (e) {
            throw new ModuleLoaderException(e);
        }
    }
};
