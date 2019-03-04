const Architecture = require('domain/sloth-machine-framework').architecture.Architecture;
const Size = require('domain/sloth-machine-framework').data.Size;
const Status = require('domain/sloth-machine-framework').interpreter.Status;
const Opcode = require('domain/sloth-machine-framework').interpreter.Opcode;
const DataUnit = require('domain/sloth-machine-framework').data.DataUnit;
const Data = require('domain/sloth-machine-framework').data.Data;
const Integer = require('domain/sloth-machine-framework').data.Integer;
const ExitStatus = require('domain/sloth-machine-framework').interpreter.ExitStatus;

module.exports = new class extends Architecture {
    /**
     * @inheritDoc
     */
    getInterpreter(system) {
        return {
            getOpcodeSize: () => new Size(1),
            getOperandsSize: () => new Size(0),
            exec: instruction => {
                switch (true) {
                    case instruction.getOpcode().eq(new Opcode([new DataUnit(0x00)])):
                        return new Status(null, new ExitStatus(0));
                    case instruction.getOpcode().eq(new Opcode([new DataUnit(0x01)])):
                        const data = new Data([
                            new DataUnit('H'.charCodeAt(0)),
                            new DataUnit('e'.charCodeAt(0)),
                            new DataUnit('l'.charCodeAt(0)),
                            new DataUnit('l'.charCodeAt(0)),
                            new DataUnit('o'.charCodeAt(0)),
                            new DataUnit(','.charCodeAt(0)),
                            new DataUnit(' '.charCodeAt(0)),
                            new DataUnit('W'.charCodeAt(0)),
                            new DataUnit('o'.charCodeAt(0)),
                            new DataUnit('r'.charCodeAt(0)),
                            new DataUnit('l'.charCodeAt(0)),
                            new DataUnit('d'.charCodeAt(0)),
                            new DataUnit('!'.charCodeAt(0)),
                        ]);
                        system.write(new Integer(1), data, new Size(13));

                        return new Status();
                }
            },
        };
    }
};
