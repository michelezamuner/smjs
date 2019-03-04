module.exports = {
    handle_error: {
        messages: {
            ErrorReceived: require('./src/handle_error/messages/ErrorReceived'),
        },
        HandleError: require('./src/handle_error/HandleError'),
        Presenter: require('./src/handle_error/Presenter'),
        Request: require('./src/handle_error/Request'),
        Response: require('./src/handle_error/Response'),
    },
};
