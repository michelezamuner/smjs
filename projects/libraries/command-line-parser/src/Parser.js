const _package = 'CommandLineParser.';

const MalformedArgsException = require('./MalformedArgsException');

module.exports = class Parser {
    static toString() { return _package + Parser.name; }

    /**
     * @param {string[]} args
     * @throws {MalformedArgsException}
     */
    constructor(args) {
        this._unparsedArgs = args;
        this._args = null;
    }

    /**
     * @param {string|number|undefined|null} name
     * @return {string|null}
     */
    getArgument(name) {
        if (this._args === null) {
            this._args = this._parse();
        }

        if (name === undefined || name === null) {
            name = 0;
        }

        if (!(name in this._args)) {
            return null;
        }

        return this._args[name];
    }

    /**
     * @return {Object}
     * @throws {MalformedArgsException}
     * @private
     */
    _parse() {
        const parsedArgs = {};

        for (const arg of this._unparsedArgs) {
            if (arg.startsWith('--')) {
                const {name, value} = this._parseArgument(arg, 2);
                parsedArgs[name] = value;
                continue;
            }
            if (arg.startsWith('-')) {
                const {name, value} = this._parseArgument(arg, 1);
                parsedArgs[name] = value;
                continue;
            }

            const indexes = Object.keys(parsedArgs)
                .map(key => parseInt(key))
                .filter(key => Number.isInteger(key));
            const lastIndex = indexes.length === 0 ? -1 : Math.max.apply(Math, indexes);
            parsedArgs[lastIndex + 1] = arg;
        }

        return parsedArgs;
    }

    /**
     * @param {string} arg
     * @param {number} start
     * @return {{name: string, value: string}}
     * @throws {MalformedArgsException}
     * @private
     */
    _parseArgument(arg, start) {
        const assign = arg.indexOf('=');
        if (assign === -1) {
            throw new MalformedArgsException(`Missing assignment operator in "${arg}"`);
        }

        const name = arg.substring(start, assign);
        const value = this._trimQuotes(arg.substring(assign + 1));

        return {name, value};
    }

    /**
     * @param {string} value
     * @return {string}
     * @private
     */
    _trimQuotes(value) {
        if (!value.startsWith('\'') && !value.startsWith('"')) {
            return value;
        }

        return value.substring(1, value.length - 1);
    }
};
