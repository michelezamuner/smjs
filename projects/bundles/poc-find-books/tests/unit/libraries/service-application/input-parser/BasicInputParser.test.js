const BasicInputParser = require('../../../../../src/libraries/service-application/input-parser/BasicInputParser');
const InputParser = require('../../../../../src/libraries/service-application/input-parser/InputParser');
const ServiceRequest = require('../../../../../src/libraries/service-application/input-parser/ServiceRequest');
const ServiceApplicationException = require('../../../../../src/libraries/service-application/ServiceApplicationException');

/**
 * @type {null|BasicInputParser}
 */
let parser = null;

beforeEach(() => {
    parser = new BasicInputParser();
});

test('implements interface', () => {
    expect(parser).toBeInstanceOf(InputParser);
});

test('provides fqcn', () => {
    expect(InputParser.toString()).toBe('FindBooks.ServiceApplication.InputParser.InputParser');
    expect(BasicInputParser.toString()).toBe('FindBooks.ServiceApplication.InputParser.BasicInputParser');
    expect(ServiceRequest.toString()).toBe('FindBooks.ServiceApplication.InputParser.ServiceRequest');
});

test('parses valid input into request', () => {
    const input1 = '/search-books?search=my+search+string';
    expect(parser.parse(input1)).toStrictEqual(new ServiceRequest('search-books', { search: 'my search string'}));

    const input2 = '/search-books';
    expect(parser.parse(input2)).toStrictEqual(new ServiceRequest('search-books'));
});

test('fails if parsing invalid input', () => {
    const input = 'invalid input';

    expect(() => parser.parse(input)).toThrow(ServiceApplicationException);
    expect(() => parser.parse(input)).toThrow(`Invalid input: "${input}"`);
});
