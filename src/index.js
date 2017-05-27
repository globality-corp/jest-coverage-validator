import { spawnSync } from 'child_process';
import {
    compact,
    findIndex,
    get,
    partial,
    takeRight,
} from 'lodash';

const commands = {
    base: 'jest',
    coverage: ['--coverage', '--json'],
    showConfig: ['--showConfig', '--json'],
};

const HEAD_STRING = 'Jest: Coverage for';

function getThresholds(config = {}) {
    return get(JSON.parse(config), 'globalConfig.coverageThreshold.global');
}

function splitResults(results = '') {
    return results.split(/\r?\n/);
}

function getLastLines(results = [], count = 0) {
    const resultsList = splitResults(results);
    return takeRight(compact(resultsList), count);
}

function matchLine(str = '', line = '') {
    return line.match(str);
}

function findFailures(thresholds = [], lines = []) {
    return thresholds.map((threshold) => {
        const matchString = `${HEAD_STRING} ${threshold}`;
        const appliedMatchLine = partial(matchLine, matchString);
        const index = findIndex(lines, appliedMatchLine);
        return index > -1 ? { threshold, failure: lines[index] } : false;
    }).filter(failure => failure);
}

export default function validate(pass = Function, fail = Function) {
    const config = spawnSync(commands.base, commands.showConfig).stderr.toString();
    const results = spawnSync(commands.base, commands.coverage).stderr.toString();
    const thresholdList = Object.keys(getThresholds(config));
    const potentialFailures = getLastLines(results, thresholdList.length);
    const failures = findFailures(thresholdList, potentialFailures);

    return (failures.length > 0) ? fail(failures) : pass(true);
}
