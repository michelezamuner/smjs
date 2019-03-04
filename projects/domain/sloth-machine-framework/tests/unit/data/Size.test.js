const Size = require('../../../src/data/Size');
const Integer = require('../../../src/data/Integer');

test('is integer', () => {
    const size = new Size();

    expect(size).toBeInstanceOf(Integer);
});
