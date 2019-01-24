const ArchitectureLoader = require('./src/application/architecture_loader/ArchitectureLoader');
const UnsupportedArchitectureException = require('./src/application/architecture_loader/UnsupportedArchitectureException');
const InvalidArchitectureException = require('./src/application/architecture_loader/InvalidArchitectureException');
const System = require('./src/application/system/System');

module.exports = {
    ArchitectureLoader,
    UnsupportedArchitectureException,
    InvalidArchitectureException,
    System,
};
