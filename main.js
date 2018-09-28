const Parser = require('./src/Parser/Parser');
const Interpreter = require('./src/Interpreter/Interpreter');
const Registers = require('./src/Interpreter/Registers');
const Processor = require('./src/Processor/Processor');

require('fs').readFile(process.argv[2], {encoding: 'utf-8'}, (err, data) => {
    const registers = new Registers;
    const processor = new Processor(new Interpreter(registers), registers);
    const code = (new Parser(registers)).parse(data);
    const status = processor.run(code);
    process.exit(status);
});
