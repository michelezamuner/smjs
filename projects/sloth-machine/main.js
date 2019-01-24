const Container = require('container').Container;
const Provider = require('./src/app/Provider');
const Parser = require('command-line-parser').CommandLineParser;
const System = require('./src/app/System');
const NativeSystem = require('./src/app/NativeSystem');
const App = require('./src/app/App');

let config = null;
switch (process.env.SM_ENV) {
    case 'test':
        config = require('./config/test');
        break;
    default:
        config = require('./config/app');
}

const container = new Container();
const provider = new Provider();
const parser = new Parser(process.argv.slice(2));

container.bind('config', config);
container.bind(Parser, parser);
container.bind(System, NativeSystem);
provider.register(container);

const app = new App(container);

app.run();
