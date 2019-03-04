module.exports = {
    architecture: {
        Architecture: require('./src/architecture/Architecture'),
        System: require('./src/architecture/System'),
    },
    data: {
        Integer: require('./src/data/Integer'),
        Size: require('./src/data/Size'),
        DataUnit: require('./src/data/DataUnit'),
        Data: require('./src/data/Data'),
    },
    interpreter: {
        Interpreter: require('./src/interpreter/Interpreter'),
        InterpreterException: require('./src/interpreter/InterpreterException'),
        ExitStatus: require('./src/interpreter/ExitStatus'),
        Status: require('./src/interpreter/Status'),
        Opcode: require('./src/interpreter/Opcode'),
    },
    processor: {
        Processor: require('./src/processor/Processor'),
        ProcessorException: require('./src/processor/ProcessorException'),
    },
    program: {
        Program: require('./src/program/Program'),
    }
};
