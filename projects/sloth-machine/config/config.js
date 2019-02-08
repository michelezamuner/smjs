const adapters = __dirname + '/../src/adapters';
const config = {
    routes: {
        'sloth_machine/run_program': {
            controller: `${adapters}/sloth_machine/run_program/controller/Controller`,
            action: 'runProgram(architecture, file)',
            viewInterface: `${adapters}/sloth_machine/run_program/presenter/View`,
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
