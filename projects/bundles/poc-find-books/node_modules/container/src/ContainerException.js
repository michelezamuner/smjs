const _package = 'Container.';

/**
 * Thrown when an error happens while trying to make an instance.
 */
module.exports = class ContainerException extends Error {
    static toString() { return _package + ContainerException.name; }
};
