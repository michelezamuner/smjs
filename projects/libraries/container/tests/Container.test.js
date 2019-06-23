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
    static toString() { return 'Fully.Qualified.Class.Name'; }
    constructor() {
        if (new.target === Interface) {
            throw 'Cannot instantiate interface';
        }
    }
}

/**
 * @type {null|Container}
 */
let container = null;

beforeEach(() => {
    container = new Container();
});

test('provide fqcn', () => {
    expect(Container.toString()).toBeDefined();
    expect(ContainerException.toString()).toBeDefined();
});

test('returns same instance when creating itself', () => {
    const instance = container.make(Container);

    expect(instance).toBe(container);
});

test('creates instance from class', () => {
    const instance = container.make(Test);

    expect(instance).toBeInstanceOf(Test);
});

test('creates instance from class with context', () => {
    class Type { constructor(context) { this.context = context; }}
    const context = 'context';
    const instance = container.make(Type, context);

    expect(instance.context).toBe(context);
});

test('creates instance from unbound dependencies', () => {
    const instance = container.make(Test2);

    expect(instance).toBeInstanceOf(Test2);
    expect(instance.getTest()).toBeInstanceOf(Test);
    expect(instance.getTest1()).toBeInstanceOf(Test1);
    expect(instance.getTest1().getTest()).toBeInstanceOf(Test);
});

test('creates instance from unbound dependency as context', () => {
    const test = new Test();
    const instance = container.make(Test2, { [Test]: test });

    expect(instance).toBeInstanceOf(Test2);
    expect(instance.getTest()).toBe(test);
    expect(instance.getTest1().getTest()).toBe(test);
});

test('creates instance from bound instances', () => {
    container.bind(Test, new TestAlternate());
    const instance = container.make(Test2);

    expect(instance.getTest()).toBeInstanceOf(TestAlternate);
    expect(instance.getTest1().getTest()).toBeInstanceOf(TestAlternate);
});

test('creates instance from bound types', () => {
    container.bind(Test, TestAlternate);
    const instance = container.make(Test2);

    expect(instance.getTest()).toBeInstanceOf(TestAlternate);
    expect(instance.getTest1().getTest()).toBeInstanceOf(TestAlternate);
});

test('creates instance from bound callbacks', () => {
    container.bind(Test, ctr => {
        const instance = new TestAlternate();
        instance.container = ctr;

        return instance;
    });
    const instance = container.make(Test2);

    expect(instance.getTest()).toBeInstanceOf(TestAlternate);
    expect(instance.getTest1().getTest()).toBeInstanceOf(TestAlternate);
    expect(instance.getTest().container).toBe(container);
    expect(instance.getTest1().getTest().container).toBe(container);
});

test('creates instance from bound callbacks with context', () => {
    class Regular extends Interface {}
    class Special extends Interface {}
    class Target {
        static get __DEPS__() { return [ Interface ]; }
        constructor(dep) { this._dep = dep; }
        getDep() { return this._dep; }
    }

    const specialContext = 'specialContext';
    container.bind(Interface, (ctr, ctx) => ctr.make(ctx === specialContext ? Special : Regular));

    const regular = container.make(Target);
    expect(regular.getDep()).toBeInstanceOf(Regular);

    const special = container.make(Target, specialContext);
    expect(special.getDep()).toBeInstanceOf(Special);
});

test('dependency as context shadows bound reference', () => {
    const test1 = new Test();
    const test2 = new Test();

    container.bind(Test, test1);

    const instance = container.make(Test2, { [Test]: test2 });

    expect(instance).toBeInstanceOf(Test2);
    expect(instance.getTest()).toBe(test2);
    expect(instance.getTest1().getTest()).toBe(test2);
});

test('fails if trying to make an invalid bound type', () => {
    const error = 'error';
    class Ref {
        static toString() { return 'ref'; }

        constructor() {
            throw Ref.error;
        }
    }

    container.bind('bound', Ref);

    Ref.error = error;
    expect(() => container.make('bound')).toThrow(ContainerException);
    expect(() => container.make('bound'))
        .toThrow(`Error making bound reference "bound": Error making unbound reference "ref": ${error}`);

    Ref.error = new Error(error);
    expect(() => container.make('bound')).toThrow(ContainerException);
    expect(() => container.make('bound'))
        .toThrow(`Error making bound reference "bound": Error making unbound reference "ref": ${error}`);
});

test('fails if trying to make an invalid bound callback', () => {
    const ref = 'ref';
    const error = 'error';

    container.bind(ref, () => {
        throw error;
    });
    expect(() => container.make(ref)).toThrow(ContainerException);
    expect(() => container.make(ref)).toThrow(`Error making bound reference "${ref}": ${error}`);

    container.bind(ref, () => {
        throw new Error(error);
    });
    expect(() => container.make(ref)).toThrow(ContainerException);
    expect(() => container.make(ref)).toThrow(`Error making bound reference "${ref}": ${error}`);
});

test('fails if trying to make an invalid reference with dependencies', () => {
    const error = 'error';
    class Ref {
        static get __DEPS__() { return [ 'dep' ]; }
        static toString() { return 'Reference'; }

        constructor() {
            throw Ref.error
        }
    }

    container.bind('dep', 'something');

    Ref.error = error;
    expect(() => container.make(Ref)).toThrow(ContainerException);
    expect(() => container.make(Ref)).toThrow(`Error making reference with dependencies "${Ref}": ${error}`);

    Ref.error = new Error(error);
    expect(() => container.make(Ref)).toThrow(ContainerException);
    expect(() => container.make(Ref)).toThrow(`Error making reference with dependencies "${Ref}": ${error}`);
});

test('fails if trying to make a non constructable unbound reference', () => {
    const ref = 'unbound ref';
    expect(() => container.make(ref)).toThrow(ContainerException);
    expect(() => container.make(ref)).toThrow(`Error making unbound reference "${ref}": ref is not a constructor`);
});

test('fails if trying to make an unbound interface', () => {
    const ref = 'Fully.Qualified.Class.Name';
    expect(() => container.make(Interface)).toThrow(ContainerException);
    expect(() => container.make(Interface))
        .toThrow(`Error making unbound reference "${ref}": Cannot instantiate interface`);
});
