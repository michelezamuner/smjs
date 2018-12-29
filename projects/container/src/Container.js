module.exports = class Container {
    constructor() {
        this._bound = {};
    }

    bind(type, object) {
        this._bound[type] = object;
    }

    make(type) {
        if (type in this._bound) {
            return this._bound[type];
        }

        if (type.__DEPS__ !== undefined) {
            const deps = [];
            for (const dep of type.__DEPS__) {
                deps.push(this.make(dep));
            }

            return new type(...deps);
        }

        return new type();
    }
};
