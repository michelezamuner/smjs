const Presenter = require('./Presenter');
const ArchitectureLoader = require('architecture-loader').ArchitectureLoader;
const ProgramLoader = require('program-loader').ProgramLoader;
const System = require('architecture-loader').System;

module.exports = class AdapterDependencies {
    static get __DEPS__() { return [Presenter, ArchitectureLoader, ProgramLoader, System]; }

    /**
     * @param {Presenter} presenter
     * @param {ArchitectureLoader} architectureLoader
     * @param {ProgramLoader} programLoader
     * @param {System} system
     */
    constructor(presenter, architectureLoader, programLoader, system) {
        this._presenter = presenter;
        this._architectureLoader = architectureLoader;
        this._programLoader = programLoader;
        this._system = system;
    }

    /**
     * @return {Presenter}
     */
    getPresenter() {
        return this._presenter;
    }

    /**
     * @return {ArchitectureLoader}
     */
    getArchitectureLoader() {
        return this._architectureLoader;
    }

    /**
     * @return {ProgramLoader}
     */
    getProgramLoader() {
        return this._programLoader;
    }

    /**
     * @return {System}
     */
    getSystem() {
        return this._system;
    }
};
