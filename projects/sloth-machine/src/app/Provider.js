const Container = require('container').Container;
const ArchitectureLoaderInterface = require('core').ArchitectureLoader;
const ArchitectureLoader = require('../adapters/cli/architecture/LocalArchitectureLoader');

module.exports = class Provider {
    /**
     * @param {Container} container
     */
    register(container) {
        const config = container.make('config');
        container.bind(ArchitectureLoaderInterface, new ArchitectureLoader(config.mods));
    }
};
