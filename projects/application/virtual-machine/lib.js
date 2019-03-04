module.exports = {
    run_program: {
        messages: {
            ApplicationFailed: require('./src/run_program/messages/ApplicationFailed'),
            ArchitectureLoaded: require('./src/run_program/messages/ArchitectureLoaded'),
            ExecutionTerminated: require('./src/run_program/messages/ExecutionTerminated'),
            ProgramLoaded: require('./src/run_program/messages/ProgramLoaded'),
        },
        Request: require('./src/run_program/Request'),
        RunProgram: require('./src/run_program/RunProgram'),
        MissingProgramReferenceException: require('./src/run_program/MissingProgramReferenceException'),
        Presenter: require('./src/run_program/Presenter'),
        Response: require('./src/run_program/Response'),
    },
};
