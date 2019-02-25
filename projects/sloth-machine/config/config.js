const adapters = __dirname + '/../src/adapters';
const config = {
    routes: {
        'console_application/handle_error': {
            controller: `${adapters}/console_application/handle_error/controller/Controller`,
            action: 'handleError(error)',
            viewInterface: `${adapters}/console_application/handle_error/presenters/shared_presenter/View`,
            views: {
                error: `${adapters}/console_application/handle_error/views/ErrorView`,
            }
        },
        'sloth_machine/run_program': {
            controller: `${adapters}/sloth_machine/run_program/controller/Controller`,
            action: 'runProgram(architecture, file)',
            viewInterface: `${adapters}/sloth_machine/run_program/presenters/ConsolePresenter/View`,
            views: {
                integrated: `${adapters}/sloth_machine/run_program/views/IntegratedView`,
                clean: `${adapters}/sloth_machine/run_program/views/CleanView`,
                verbose: `${adapters}/sloth_machine/run_program/views/VerboseView`
            }
        }
    }
};

const envConfig = process.env.SM_ENV === 'test'
    ? require('./config-test')
    : require('./config-app');

module.exports = { ...config, ... envConfig };
