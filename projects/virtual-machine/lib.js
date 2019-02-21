const Request = require('./src/application/virtual_machine/run_program/Request');
const RunProgram = require('./src/application/virtual_machine/run_program/RunProgram');
const MissingProgramReferenceException = require('./src/application/virtual_machine/run_program/MissingProgramReferenceException');
const Presenter = require('./src/application/virtual_machine/run_program/Presenter');
const Response = require('./src/application/virtual_machine/run_program/Response');

module.exports = {
    Request,
    RunProgram,
    MissingProgramReferenceException,
    Presenter,
    Response,
};
