const Container = require('container').Container;
const Provider = require('./src/app/Provider');
const Parser = require('command-line-parser').CommandLineParser;
const App = require('./src/app/App');
const AppException = require('./src/app/AppException');

let config = null;
switch (process.env.SM_ENV) {
    case 'test':
        config = require('./config/test');
        break;
    default:
        config = require('./config/app');
}

try {
    const container = new Container();
    container.bind('config', config);
    const provider = new Provider();
    const parser = new Parser(process.argv.slice(2));
    const app = new App(container, provider);

    app.run(parser);
} catch (e) {
    console.error(e instanceof AppException ? e.message : e);
    process.exit(127);
}
