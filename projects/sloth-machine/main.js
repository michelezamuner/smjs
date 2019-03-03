const Container = require('container').Container;
const Parser = require('command-line-parser').CommandLineParser;
const Launcher = require('./src/Launcher');

const config = require('./config/config');
const container = new Container();

for (const provider of config.providers) {
    container.make(provider).register();
}

const launcher = container.make(Launcher);
launcher.launch(new Parser(process.argv.slice(2)));
