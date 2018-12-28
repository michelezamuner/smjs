const Container = require('container').Container;
const Parser = require('parser').CommandLineParser;
const App = require('./src/app/App');

try {
    const container = new Container();
    const parser = new Parser(process.argv.slice(2));
    const app = new App(container, parser);

    app.run();
} catch (e) {
    console.error(e instanceof Error ? e.message : e);
    process.exit(127);
}
