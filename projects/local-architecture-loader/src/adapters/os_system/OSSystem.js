const System = require('architecture-loader').System;
const Filesystem = require('./Filesystem');
const Size = require('sloth-machine-framework').Size;

module.exports = class OSSystem extends System {
    static get __DEPS__() { return [Filesystem]; }

    /**
     * @param {Filesystem} filesystem
     */
    constructor(filesystem) {
        super();
        this._filesystem = filesystem;
    }

    /**
     * @inheritDoc
     */
    write(fd, data, size) {
        const file = parseInt(fd.format());
        const buf = Buffer.from(data.toArray().map(unit => parseInt(unit.format())));
        const count = parseInt(size.format());
        const written = this._filesystem.write(file, buf, count);

        return new Size(written);
    }
};
