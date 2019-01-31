const Size = require('../../../../../src/domain/sloth-machine-framework/data/Size');
const Integer = require('../../../../../src/domain/sloth-machine-framework/data/Integer');

test('is integer', () => {
    const size = new Size();

    expect(size).toBeInstanceOf(Integer);
});
