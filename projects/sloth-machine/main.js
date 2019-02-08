const Container = require('container').Container;
const Provider = require('./src/app/Provider');
const Router = require('router').Router;
const NativeLoader = require('router').NativeLoader;
const Parser = require('command-line-parser').CommandLineParser;
const App = require('./src/app/App');

const config = require('./config/config');
const container = new Container();
const provider = new Provider(config);
provider.register(container);

const app = new App(new Router(container, new NativeLoader(), config.routes));
app.run(new Parser(process.argv.slice(2)));
