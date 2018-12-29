const UnsupportedArchitectureException = require('./src/domain/smf/architecture/UnsupportedArchitectureException');
const ArchitectureLoader = require('./src/application/architecture/ArchitectureLoader');
const RunProgram = require('./src/application/vm/run_program/RunProgram');
const Request = require('./src/application/vm/run_program/Request');

module.exports = {
    ArchitectureLoader,
    UnsupportedArchitectureException,
    RunProgram,
    Request
};
