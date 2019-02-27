const ModuleLoader = require('./ModuleLoader');
const CannotFindModuleException = require('./CannotFindModuleException');

module.exports = class NativeModuleLoader extends ModuleLoader {
    /**
     * @override
     */
    load(module) {
        try {
            return require(module);
        } catch (e) {
            if (e.message.startsWith('Cannot find module')) {
                throw new CannotFindModuleException();
            }

            throw e;
        }
    }
};
