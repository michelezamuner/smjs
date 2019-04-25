const _package = 'SlothMachine.VirtualMachine.RunProgram.';

const Presenter = require('./Presenter');
const ArchitectureLoader = require('app/architecture-loader').ArchitectureLoader;
const ProgramLoader = require('app/program-loader').ProgramLoader;
const System = require('app/system').System;
const Notifier = require('app/notifications').Notifier;

module.exports = class AdapterDependencies {
    static get __DEPS__() { return [Presenter, ArchitectureLoader, ProgramLoader, System, Notifier]; }
    static toString() { return _package + AdapterDependencies.name; }

    /**
     * @param {Presenter} presenter
     * @param {ArchitectureLoader} architectureLoader
     * @param {ProgramLoader} programLoader
     * @param {System} system
     * @param {Notifier} notifier
     */
    constructor(presenter, architectureLoader, programLoader, system, notifier) {
        this._presenter = presenter;
        this._architectureLoader = architectureLoader;
        this._programLoader = programLoader;
        this._system = system;
        this._notifier = notifier;
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

    /**
     * @return {Notifier}
     */
    getNotifier() {
        return this._notifier;
    }
};
