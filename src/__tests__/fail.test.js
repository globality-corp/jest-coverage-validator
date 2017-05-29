import {
    validate,
} from '../';

import {
    config as mockedConfig,
    failures as mockedFailures,
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
        return mockedConfig.globalConfig.coverageThreshold.global;
    },

    getLastLines: function getLastLines() {
        return [
            mockedFailures.branches,
            mockedFailures.functions,
            mockedFailures.lines,
            mockedFailures.statements,
        ];
    },

    findFailures: function findFailures() {
        return [
            { branches: mockedFailures.branches },
            { functions: mockedFailures.functions },
            { lines: mockedFailures.lines },
            { statements: mockedFailures.statements },
        ];
    },
}));

describe('Jest coverage validator', () => {
    it('should return a list of failures', () => {
        const fail = jest.fn(fails => fails);
        const pass = jest.fn(val => val);
        const validation = validate(fail, pass);

        expect(fail).toHaveBeenCalled();
        expect(validation.length).toEqual(4);
        expect(pass.mock.calls.length).toEqual(0);
    });
});
