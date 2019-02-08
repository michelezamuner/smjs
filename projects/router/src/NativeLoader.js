const ModuleLoader = require('./ModuleLoader');
const ModuleLoaderException = require('./ModuleLoaderException');

module.exports = class NativeLoader extends ModuleLoader {
    /**
     * @inheritDoc
     */
    load(path) {
        try {
            return require(path);
        } catch (e) {
            throw new ModuleLoaderException(e);
        }
    }
};
