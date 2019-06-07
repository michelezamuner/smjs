module.exports = class SearchCompleteView {
    constructor() {
        if (new.target === SearchCompleteView) {
            throw 'Cannot instantiate interface';
        }
    }

    render() {
        throw 'Not implemented';
    }
};