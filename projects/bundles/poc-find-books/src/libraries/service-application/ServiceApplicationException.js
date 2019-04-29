const _package = 'FindBooks.ServiceApplication.';

/**
 * Thrown when an error happens while using the service application.
 */
module.exports = class ServiceApplicationException extends Error {
    static toString() { return _package + ServiceApplicationException.name; }
};
