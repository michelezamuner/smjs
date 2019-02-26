const Container = require('container').Container;
const Parser = require('command-line-parser').CommandLineParser;
const App = require('./src/app/App');

const config = require('./config/config');
const container = new Container();

for (const provider of config.providers) {
    container.make(provider).register();
}

const app = container.make(App);
app.run(new Parser(process.argv.slice(2)));
