const Container = require('container').Container;
const Launcher = require('./src/Launcher');
const config = require('./config/config');

const container = new Container();
const launcher = new Launcher(container, config);

launcher.launch();
