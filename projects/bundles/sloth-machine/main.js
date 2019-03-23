const Container = require('container').Container;
const Parser = require('command-line-parser').CommandLineParser;
const Launcher = require('./src/Launcher');

const container = new Container();
const config = require('./config/config');
const launcher = new Launcher(container, config);
const parser = new Parser(process.argv.slice(2));

launcher.launch(parser);
