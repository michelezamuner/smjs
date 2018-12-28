module.exports = class Container {
    make(type) {
        if (typeof type === 'function') {
            return new type();
        }
    }
};
