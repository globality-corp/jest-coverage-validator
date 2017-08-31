import { spawnSync } from 'child_process';
import { compact, findIndex, get, partial, takeRight } from 'lodash';

export const commands = {
    base: 'jest',
    coverage: ['--coverage --maxWorkers 4', '--json'],
    showConfig: ['--showConfig', '--json'],
};

export const HEAD_STRING = 'Jest: Coverage for';

export function getThresholds(config = {}) {
    return get(JSON.parse(config), 'globalConfig.coverageThreshold.global');
}

export function splitResults(results = '') {
    return results.split(/\r?\n/);
}

export function getLastLines(results = '', count = 0) {
    const resultsList = splitResults(results);
    return takeRight(compact(resultsList), count);
}

export function matchLine(str = '', line = '') {
    return line.match(str);
}

export function findFailures(thresholds = [], lines = []) {
    return thresholds
        .map((threshold) => {
            const matchString = `${HEAD_STRING} ${threshold}`;
            const appliedMatchLine = partial(matchLine, matchString);
            const index = findIndex(lines, appliedMatchLine);
            return index > -1 ? { threshold, failure: lines[index] } : false;
        })
        .filter(failure => failure);
}

export function getStderr(base, command) {
    return spawnSync(base, command).stderr.toString();
}

export const appliedGetStderr = partial(getStderr, commands.base);
