const Architecture = require('./src/domain/sloth-machine-framework/architecture/Architecture');
const System = require('./src/domain/sloth-machine-framework/architecture/System');
const Interpreter = require('./src/domain/sloth-machine-framework/interpreter/Interpreter');
const InterpreterException = require('./src/domain/sloth-machine-framework/interpreter/InterpreterException');
const ExitStatus = require('./src/domain/sloth-machine-framework/interpreter/ExitStatus');
const Status = require('./src/domain/sloth-machine-framework/interpreter/Status');
const Opcode = require('./src/domain/sloth-machine-framework/interpreter/Opcode');
const Program = require('./src/domain/sloth-machine-framework/program/Program');
const Processor = require('./src/domain/sloth-machine-framework/processor/Processor');
const ProcessorException = require('./src/domain/sloth-machine-framework/processor/ProcessorException');
const Integer = require('./src/domain/sloth-machine-framework/data/Integer');
const Size = require('./src/domain/sloth-machine-framework/data/Size');
const DataUnit = require('./src/domain/sloth-machine-framework/data/DataUnit');
const Data = require('./src/domain/sloth-machine-framework/data/Data');

module.exports = {
    Architecture,
    System,
    Interpreter,
    InterpreterException,
    ExitStatus,
    Status,
    Opcode,
    Program,
    Processor,
    ProcessorException,
    Integer,
    Size,
    DataUnit,
    Data,
};
