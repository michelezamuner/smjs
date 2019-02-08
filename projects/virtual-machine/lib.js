const Request = require('./src/application/virtual_machine/run_program/Request');
const RunProgram = require('./src/application/virtual_machine/run_program/RunProgram');
const MissingProgramReferenceException = require('./src/application/virtual_machine/run_program/MissingProgramReferenceException');
const Presenter = require('./src/application/virtual_machine/run_program/Presenter');
const Response = require('./src/application/virtual_machine/run_program/Response');
const SuccessResponse = require('./src/application/virtual_machine/run_program/SuccessResponse');
const ErrorResponse = require('./src/application/virtual_machine/run_program/ErrorResponse');

module.exports = {
    Request,
    RunProgram,
    MissingProgramReferenceException,
    Presenter,
    Response,
    SuccessResponse,
    ErrorResponse,
};
