const Status = require('../../../../../src/domain/sloth-machine-framework/interpreter/Status');

test('defaults to no jump no exit', () => {
    const status = new Status();

    expect(status.shouldJump()).toBe(false);
    expect(status.shouldExit()).toBe(false);
});

test('fails if trying to get addresses that are not set', () => {
    const status = new Status();

    expect(() => status.getJumpAddress()).toThrow('Trying to get jump address when program is not jumping');
    expect(() => status.getExitStatus()).toThrow('Trying to get exit status when program is not exiting');
});

test('can be set to jump', () => {
    const jumpAddress = {};
    const status = new Status(jumpAddress);

    expect(status.shouldJump()).toBe(true);
    expect(status.getJumpAddress()).toBe(jumpAddress);
});

test('can be set to exit', () => {
    const exitStatus = {};
    const status = new Status(null, exitStatus);

    expect(status.shouldExit()).toBe(true);
    expect(status.getExitStatus()).toBe(exitStatus);
});

test('cannot be both jump and exit', () => {
    const jumpStatus = new Status({});
    expect(jumpStatus.shouldExit()).toBe(false);
    expect(() => jumpStatus.getExitStatus()).toThrow('Trying to get exit status when program is not exiting');

    const exitStatus = new Status(null, {});
    expect(exitStatus.shouldJump()).toBe(false);
    expect(() => exitStatus.getJumpAddress()).toThrow('Trying to get jump address when program is not jumping');
});
