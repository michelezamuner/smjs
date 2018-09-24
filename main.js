const Parser = require('./src/Parser/Parser');
const Interpreter = require('./src/Processor/Interpreter');
const Registers = require('./src/Processor/Registers');
const Processor = require('./src/Processor/Processor');

require('fs').readFile(process.argv[2], {encoding: 'utf-8'}, (err, data) => {
    const instructions = (new Parser).parse(data);
    const registers = new Registers;
    const processor = new Processor(new Interpreter(registers), registers);
    const status = processor.run(instructions);
    process.exit(status);
});
