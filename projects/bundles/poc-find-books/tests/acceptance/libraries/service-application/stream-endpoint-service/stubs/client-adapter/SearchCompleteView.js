module.exports = class SearchCompleteView {
    constructor() {
        if (new.target === SearchCompleteView) {
            throw 'Cannot instantiate interface';
        }
    }

    renderComplete() {
        throw 'Not implemented';
    }
};