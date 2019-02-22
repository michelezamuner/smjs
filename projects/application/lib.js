module.exports = {
    application: {
        application: {
            handle_error: {
                HandleError: require('./src/application/application/handle_error/HandleError'),
                Presenter: require('./src/application/application/handle_error/Presenter'),
                Request: require('./src/application/application/handle_error/Request'),
                Response: require('./src/application/application/handle_error/Response'),
            }
        }
    }
};
