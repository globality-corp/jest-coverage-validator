import {
    appliedGetStderr,
    commands,
    findFailures,
    getLastLines,
    getThresholds,
} from './utils';

export function validate(fail = Function, pass = Function) { // eslint-disable-line
    const config = appliedGetStderr(commands.showConfig);
    const results = appliedGetStderr(commands.coverage);
    const thresholdList = Object.keys(getThresholds(config));
    const potentialFailures = getLastLines(results, thresholdList.length);
    const failures = findFailures(thresholdList, potentialFailures);

    return (failures.length > 0) ? fail(failures) : pass(true);
}
