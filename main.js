const Parser = require('./src/Parser/Parser');
const InstructionSet = require('./src/Processor/InstructionSet');
const Registers = require('./src/Processor/Registers');
const Processor = require('./src/Processor/Processor');

require('fs').readFile(process.argv[2], {encoding: 'utf-8'}, (err, data) => {
    const instructions = (new Parser).parse(data);
    const processor = new Processor(new InstructionSet, new Registers);
    process.exit(processor.run(instructions));
});
