const InputParser = require('../../../../../src/libraries/service-application/input-parser/InputParser');
const InputParserException = require('../../../../../src/libraries/service-application/input-parser/InputParserException');
const ServiceRequest = require('../../../../../src/libraries/service-application/input-parser/ServiceRequest');

test('provides fqcn', () => {
    expect(InputParser.toString()).toBe('FindBooks.ServiceApplication.InputParser.InputParser');
    expect(InputParserException.toString()).toBe('FindBooks.ServiceApplication.InputParser.InputParserException');
    expect(ServiceRequest.toString()).toBe('FindBooks.ServiceApplication.InputParser.ServiceRequest');
});