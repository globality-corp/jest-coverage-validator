import {
    validate,
} from '../';

import {
    config as mockedConfig,
} from '../__mocks__/data';

jest.mock('../utils', () => ({
    commands: {
        base: '',
        coverage: 'coverage',
        showConfig: 'showConfig',
    },

    appliedGetStderr: function appliedGetStderr(command) {
        return command;
    },

    getThresholds: function getThresholds() {
        return mockedConfig;
    },

    getLastLines: function getLastLines() {
        return [
            'line-one',
            'line-two',
            'line-three',
            'line-four',
        ];
    },

    findFailures: function findFailures() {
        return [];
    },
}));

describe('Jest coverage validator', () => {
    it('should return true (pass) ', () => {
        const fail = jest.fn(fails => fails);
        const pass = jest.fn(val => val);
        const validation = validate(fail, pass);

        expect(validate).toBeDefined();
        expect(pass).toHaveBeenCalled();
        expect(validation).toEqual(true);
        expect(fail.mock.calls.length).toEqual(0);
    });
});
