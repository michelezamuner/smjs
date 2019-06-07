module.exports = class SearchCompletePresenter {
    constructor() {
        if (new.target === SearchCompletePresenter) {
            throw 'Cannot instantiate interface';
        }
    }

    present() {
        throw 'Not implemented';
    }
};