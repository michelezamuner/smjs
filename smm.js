const Interpreter = require('./src/Architectures/SMA/Interpreter');
const InstructionSet = require('./src/Architectures/SMA/InstructionSet/InstructionSet');
const Mnemonics = require('./src/Architectures/SMA/Mnemonics');
const InstructionDependencies = require('./src/Architectures/SMA/InstructionSet/InstructionDependencies');
const DefinitionLoader = require('./src/Architectures/SMA/InstructionSet/DefinitionLoader');
const Registers = require('./src/Architectures/SMA/Registers');
const System = require('./src/Architectures/SMA/System');
const Memory = require('./src/Memory/Memory');
const Processor = require('./src/Processor/Processor');
const Loader = require('./src/Processor/Loader');
const MissingExitException = require('./src/Processor/MissingExitException');
const Word = require('./src/DataTypes/Word');

require('fs').readFile(process.argv[2], {encoding: 'binary'}, (err, data) => {
    const memory = new Memory(new Word(65535));
    const registers = new Registers();
    const dependencies = new InstructionDependencies(registers, memory, new System());
    const loader = new DefinitionLoader(__dirname + '/src/Architectures/SMA/InstructionDefinitions');
    const instructionSet = new InstructionSet(loader, dependencies);
    const interpreter = new Interpreter(instructionSet, Mnemonics.instruction);

    const processor = new Processor(interpreter, registers, memory);

    (new Loader(memory)).load(data);

    try {
        const status = processor.run();
        process.exit(status);
    } catch (e) {
        console.error(e instanceof MissingExitException ? e.getMessage() : e);
        process.exit(127);
    }
});
