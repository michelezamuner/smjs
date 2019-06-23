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
     * @param {Object|null} context
     * @return {Object}
     * @throws {ContainerException}
     */
    make(ref, context = null) {
        if (ref === Container) {
            return this;
        }

        if (this._hasUsableBound(ref, context)) {
            return this._makeBound(ref, context);
        }

        if (ref.__DEPS__ !== undefined) {
            return this._makeDependent(ref, context);
        }

        return this._makeBare(ref, context);
    }

    /**
     * @param {Object|null} context 
     * @param {Object} dep
     * @return {Object}
     * @private
     */
    _getContextDep(context, dep) {
        return context !== null && context[dep] || null;
    }
    
    /**
     * @param {Object} ref 
     * @param {Object|null} context
     * @return {boolean}
     * @private
     */
    _hasUsableBound(ref, context) {
        if (!this._bound.has(ref)) {
            return false;
        }

        return this._getContextDep(context, ref) === null;
    }

    /**
     * @param {Object} ref
     * @param {Object|null} context
     * @return {Object}
     * @throws {ContainerException}
     * @private
     */
    _makeBound(ref, context) {
        const bound = this._bound.get(ref);
        try {
            // instance
            if (bound.constructor === undefined || bound.constructor.name !== 'Function') {
                return bound;
            }

            // type
            if (bound.prototype !== undefined) {
                return this.make(bound, context);
            }

            // callback
            return bound(this, context);
        } catch (e) {
            throw new ContainerException(`Error making bound reference "${ref}": ${e.message || e}`);
        }
    }

    /**
     * @param {Function} ref
     * @param {Object|null} context
     * @return {Object}
     * @throws {ContainerException}
     * @private
     */
    _makeDependent(ref, context) {
        try {
            return new ref(...ref.__DEPS__.map(dep => this._getContextDep(context, dep) || this.make(dep, context)));
        } catch (e) {
            throw new ContainerException(`Error making reference with dependencies "${ref}": ${e.message || e}`);
        }
    }

    /**
     * @param {Function} ref
     * @param {Object|null} context
     * @return {Object}
     * @private
     */
    _makeBare(ref, context) {
        try {
            return new ref(context);
        } catch (e) {
            throw new ContainerException(`Error making unbound reference "${ref}": ${e.message || e}`);
        }
    }
};
