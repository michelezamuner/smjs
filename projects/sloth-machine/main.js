const Container = require('container').Container;
const Provider = require('./src/app/Provider');
const Parser = require('command-line-parser').CommandLineParser;
const App = require('./src/app/App');
const config = require('./config/config');
const container = new Container();
const provider = new Provider();
const parser = new Parser(process.argv.slice(2));

container.bind('config', config);
container.bind(Parser, parser);
provider.register(container);

const app = new App(container);

app.run();
