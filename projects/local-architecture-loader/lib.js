const LocalArchitectureLoader = require('./src/adapters/local_architecture_loader/LocalArchitectureLoader');
const ModuleLoader = require('./src/adapters/local_architecture_loader/ModuleLoader');
const NativeModuleLoader = require('./src/adapters/local_architecture_loader/NativeModuleLoader');
const ModuleLoaderException = require('./src/adapters/local_architecture_loader/ModuleLoaderException');
const OSSystem = require('./src/adapters/os_system/OSSystem');
const Filesystem = require('./src/adapters/os_system/Filesystem');
const NativeFilesystem = require('./src/adapters/os_system/NativeFilesystem');

module.exports = {
    LocalArchitectureLoader,
    ModuleLoader,
    NativeModuleLoader,
    ModuleLoaderException,
    OSSystem,
    Filesystem,
    NativeFilesystem,
};
