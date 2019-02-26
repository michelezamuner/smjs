const config = {
    providers: [
        require('./providers/AppProvider'),
        require('./providers/SlothMachineProvider'),
    ],
    router: {
        routes: [
            {
                identifier: 'console_application/handle_error',
                controller: require('../src/adapters/console_application/handle_error/controller/Controller'),
                action: 'handleError(error)',
            },{
                identifier: 'sloth_machine/run_program',
                controller: require('../src/adapters/sloth_machine/run_program/controller/Controller'),
                action: 'runProgram(architecture, file)',
            },
        ]
    },
    ui: {
        use_cases: [
            {
                presenter: require('application').application.application.handle_error.Presenter,
                output_models: [
                    {
                        presenter: require('../src/adapters/console_application/handle_error/presenters/console_presenter/Presenter'),
                        view: require('../src/adapters/console_application/handle_error/presenters/shared_presenter/View'),
                        views: {
                            '*': require('../src/adapters/console_application/handle_error/views/ErrorView'),
                        }
                    }
                ]
            },
            {
                presenter: require('virtual-machine').Presenter,
                output_models: [
                    {
                        presenter: require('../src/adapters/sloth_machine/run_program/presenters/console_presenter/Presenter'),
                        view: require('../src/adapters/sloth_machine/run_program/presenters/console_presenter/View'),
                        views: {
                            integrated: require('../src/adapters/sloth_machine/run_program/views/IntegratedView'),
                            // clean: require('../src/adapters/sloth_machine/run_program/views/CleanView'),
                        }
                    },
                    {
                        // presenter: require('../src/adapters/sloth_machine/run_program/presenters/textual_presenter/Presenter'),
                        // view: require('../src/adapters/sloth_machine/run_program/presenters/textual_presenter/View'),
                        views: {
                            // verbose: require('../src/adapters/sloth_machine/run_program/views/VerboseView'),
                            // archived: require('../src/adapters/sloth_machine/run_program/views/ArchivedView'),
                        }
                    }
                ]
            },
        ]
    }
};

const envConfig = process.env.SM_ENV === 'test'
    ? require('./config-test')
    : require('./config-app');

module.exports = { ...config, ... envConfig };
