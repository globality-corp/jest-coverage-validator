import {
    findFailures,
    getLastLines,
    getStderr,
    getThresholds,
    matchLine,
    splitResults,
} from '../utils';
import {
    config as mockedConfig,
    failures as mockedFailures,
    testResults,
} from '../__mocks__/data';

jest.mock('child_process', () => ({
    spawnSync: () => ({
        stderr: {
            toString: () => 'results',
        },
    }),
}));

describe('Jest coverage validator utils', () => {
    describe('findFailures', () => {
        it('should get the failures', () => {
            const results = `${testResults}\n
            ${mockedFailures.statements}\n
            ${mockedFailures.branches}\n
            ${mockedFailures.lines}\n
            ${mockedFailures.functions}`;

            const thresholdList = Object.keys(getThresholds(JSON.stringify(mockedConfig)));
            const potentialFailures = getLastLines(results, thresholdList.length);
            const failures = findFailures(thresholdList, potentialFailures);

            expect(failures.length).toEqual(4);
        });
    });

    describe('getLastLines', () => {
        it('should get the last two lines of results', () => {
            const lines = getLastLines(`${testResults}\n${mockedFailures.statements}`, 1);
            expect(lines[0]).toEqual(mockedFailures.statements);
        });
    });

    describe('getStderr', () => {
        it('should get the spawn/cli results', () => {
            const results = getStderr('base', '[--cmd]');
            expect(results).toEqual('results');
        });
    });

    describe('getThresholds', () => {
        it('should get the global config', () => {
            const config = getThresholds(JSON.stringify(mockedConfig));
            expect(config.statements).toEqual(64.88);
        });
    });

    describe('matchLine', () => {
        it('should find a failure match', () => {
            const match = matchLine('needle', 'hayneedlestack');
            expect(match[0]).toEqual('needle');
        });
    });

    describe('splitResults', () => {
        it('should split a text block into an array', () => {
            const results = splitResults(`${testResults}\n${mockedFailures.statements}`);
            expect(results.length).toEqual(6);
        });
    });
});
