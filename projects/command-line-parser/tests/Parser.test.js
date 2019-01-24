const Parser = require('../src/Parser');
const MalformedArgsException = require('../src/MalformedArgsException');

/**
 * @type {string[]}
 */
const args = [
    '--long-arg-no-quotes=long-arg-no-quotes',
    '--long-arg-single-quotes=\'long arg single quotes\'',
    '--long-arg-double-quotes="long arg double quotes"',
    '-f=flag',
    'some',
    'unnamed',
    'args'
];

/**
 * @type {null|Parser}
 */
let parser = null;

beforeEach(() => {
    parser = new Parser(args);
});

test('parse unnamed arguments', () => {
    expect(parser.getArgument()).toBe('some');
    expect(parser.getArgument(0)).toBe('some');
    expect(parser.getArgument(1)).toBe('unnamed');
    expect(parser.getArgument(2)).toBe('args');
});

test('parse named arguments', () => {
    expect(parser.getArgument('long-arg-no-quotes')).toBe('long-arg-no-quotes');
    expect(parser.getArgument('long-arg-single-quotes')).toBe('long arg single quotes');
    expect(parser.getArgument('long-arg-double-quotes')).toBe('long arg double quotes');
    expect(parser.getArgument('f')).toBe('flag');
});

test('return null if undefined argument', () => {
    expect(parser.getArgument('undefined')).toBe(null);
    expect(parser.getArgument(123)).toBe(null);
});

test('fails if missing assign', () => {
    const arg = '--arg value';
    expect(() => new Parser([arg])).toThrow(MalformedArgsException);
    expect(() => new Parser([arg])).toThrow(`Missing assignment operator in "${arg}"`);
});
