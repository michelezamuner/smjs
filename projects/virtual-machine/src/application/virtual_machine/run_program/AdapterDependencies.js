const Presenter = require('./Presenter');
const ArchitectureLoader = require('app/architecture-loader').ArchitectureLoader;
const ProgramLoader = require('program-loader').ProgramLoader;
const System = require('app/system').System;
const MessageBus = require('app/message-bus').MessageBus;

module.exports = class AdapterDependencies {
    static get __DEPS__() { return [Presenter, ArchitectureLoader, ProgramLoader, System, MessageBus]; }

    /**
     * @param {Presenter} presenter
     * @param {ArchitectureLoader} architectureLoader
     * @param {ProgramLoader} programLoader
     * @param {System} system
     * @param {MessageBus} bus
     */
    constructor(presenter, architectureLoader, programLoader, system, bus) {
        this._presenter = presenter;
        this._architectureLoader = architectureLoader;
        this._programLoader = programLoader;
        this._system = system;
        this._bus = bus;
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
     * @return {MessageBus}
     */
    getMessageBus() {
        return this._bus;
    }
};
