const _package = 'Container.';

const ContainerException = require('./ContainerException');

module.exports = class Container {
    static toString() { return _package + Container.name; }

    constructor() {
        this._bound = new Map();
    }

    /**
     * @param {Object} ref
     * @param {Object} bound
     */
    bind(ref, bound) {
        this._bound.set(ref, bound);
    }

    /**
     * @param {Object} ref
     * @return {Object}
     * @throws {ContainerException}
     */
    make(ref) {
        if (ref === Container) {
            return this;
        }

        if (this._bound.has(ref)) {
            return this._makeBound(ref);
        }

        if (ref.__DEPS__ !== undefined) {
            return this._makeDependent(ref);
        }

        return this._makeBare(ref);
    }

    /**
     * @param {Object} ref
     * @return {Object}
     * @throws {ContainerException}
     * @private
     */
    _makeBound(ref) {
        const bound = this._bound.get(ref);
        try {
            // instance
            if (bound.constructor === undefined || bound.constructor.name !== 'Function') {
                return bound;
            }

            // type
            if (bound.prototype !== undefined) {
                return this.make(bound);
            }

            // callback
            return bound();
        } catch (e) {
            throw new ContainerException(`Error making bound reference "${ref}": ${e.message || e}`);
        }
    }

    /**
     * @param {Function} ref
     * @return {Object}
     * @throws {ContainerException}
     * @private
     */
    _makeDependent(ref) {
        try {
            return new ref(...ref.__DEPS__.map(dep => this.make(dep)));
        } catch (e) {
            throw new ContainerException(`Error making reference with dependencies "${ref}": ${e.message || e}`);
        }
    }

    /**
     * @param {Function} ref
     * @return {Object}
     * @private
     */
    _makeBare(ref) {
        try {
            return new ref();
        } catch (e) {
            throw new ContainerException(`Error making unbound reference "${ref}": ${e.message || e}`);
        }
    }
};
