const Container = require('../src/Container');

class Test {}

const container = new Container();

test('create object from class', () => {
    const instance = container.make(Test);

    expect(instance).toBeInstanceOf(Test);
});
