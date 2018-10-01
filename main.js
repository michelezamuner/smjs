const Parser = require('./src/Interpreter/Parser');
const Interpreter = require('./src/Interpreter/Interpreter');
const RegistersFactory = require('./src/Registers/RegistersFactory');
const Registers = require('./src/Interpreter/Registers');
const Processor = require('./src/Processor/Processor');

require('fs').readFile(process.argv[2], {encoding: 'utf-8'}, (err, data) => {
    const registers = new Registers(new RegistersFactory);
    const interpreter = new Interpreter(registers);
    const processor = new Processor(interpreter, registers);
    const code = (new Parser(registers)).parse(data);
    const status = processor.run(code);
    process.exit(status);
});
