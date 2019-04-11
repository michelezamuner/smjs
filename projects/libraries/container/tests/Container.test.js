const Container = require('../src/Container');
const ContainerException = require('../src/ContainerException');

class Test {}
class TestAlternate {}
class Test1 {
    static get __DEPS__() { return [Test]; }
    constructor(test) { this._test = test; }
    getTest() { return this._test; }
}
class Test2 {
    static get __DEPS__() { return [Test, Test1]; }
    constructor(test, test1) { this._test = test; this._test1 = test1; }
    getTest() { return this._test; }
    getTest1() { return this._test1; }
}
class Interface {
    constructor() {
        throw 'Cannot instantiate interface';
    }
}

const container = new Container();

test('returns same instance when creating itself', () => {
    const instance = container.make(Container);

    expect(instance).toBe(container);
});

test('creates instance from class', () => {
    const instance = container.make(Test);

    expect(instance).toBeInstanceOf(Test);
});

test('creates instance from unbound dependencies', () => {
    const instance = container.make(Test2);

    expect(instance).toBeInstanceOf(Test2);
    expect(instance.getTest()).toBeInstanceOf(Test);
    expect(instance.getTest1()).toBeInstanceOf(Test1);
    expect(instance.getTest1().getTest()).toBeInstanceOf(Test);
});

test('creates instance from bound instances', () => {
    container.bind(Test, new TestAlternate());
    const instance = container.make(Test2);

    expect(instance.getTest()).toBeInstanceOf(TestAlternate);
    expect(instance.getTest1().getTest()).toBeInstanceOf(TestAlternate);
});

test('creates object from bound types', () => {
    container.bind(Test, TestAlternate);
    const instance = container.make(Test2);

    expect(instance.getTest()).toBeInstanceOf(TestAlternate);
    expect(instance.getTest1().getTest()).toBeInstanceOf(TestAlternate);
});

test('creates object from bound callbacks', () => {
    container.bind(Test, () => new TestAlternate());
    const instance = container.make(Test2);

    expect(instance.getTest()).toBeInstanceOf(TestAlternate);
    expect(instance.getTest1().getTest()).toBeInstanceOf(TestAlternate);
});

test('fails if trying to make an unbound value', () => {
    const ref = 'unbound ref';
    expect(() => container.make(ref)).toThrow(ContainerException);
    expect(() => container.make(ref)).toThrow(`Unbound reference "${ref}": ref is not a constructor`);
});

test('fails if trying to make an unbound interface', () => {
    expect(() => container.make(Interface)).toThrow(ContainerException);
    expect(() => container.make(Interface)).toThrow(`Unbound reference "Interface": Cannot instantiate interface`);
});
