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
    const input1 = 'format: json\nclient: 1234\n/books/search?text=search&limit=10';
    const request1 = new ServiceRequest(
        'books/search',
        { text: 'search', limit: 10 },
        { format: 'json', client: 1234 }
    );
    expect(parser.parse(input1)).toStrictEqual(request1);

    const input2 = '/books/search';
    expect(parser.parse(input2)).toStrictEqual(new ServiceRequest('books/search'));
});

test('fails if parsing invalid input', () => {
    const input = 'invalid input';

    expect(() => parser.parse(input)).toThrow(ServiceApplicationException);
    expect(() => parser.parse(input)).toThrow(`Invalid input: "${input}"`);
});
