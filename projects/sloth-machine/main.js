const Container = require('container').Container;
const Provider = require('./src/app/Provider');
const Parser = require('parser').CommandLineParser;
const App = require('./src/app/App');
const AppException = require('./src/app/AppException');
const config = require('./config/app');

try {
    const container = new Container();
    container.bind('config', config);
    const provider = new Provider();
    const parser = new Parser(process.argv.slice(2));
    const app = new App(container, provider, parser);

    app.run();
} catch (e) {
    console.error(e instanceof AppException ? e.message : e);
    process.exit(127);
}
