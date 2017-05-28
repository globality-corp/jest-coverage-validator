'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getThresholds = getThresholds;
exports.splitResults = splitResults;
exports.getLastLines = getLastLines;
exports.matchLine = matchLine;
exports.findFailures = findFailures;
exports.validate = validate;

var _child_process = require('child_process');

var _lodash = require('lodash');

var commands = {
    base: 'jest',
    coverage: ['--coverage', '--json'],
    showConfig: ['--showConfig', '--json']
};

var HEAD_STRING = 'Jest: Coverage for';

function getThresholds() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return (0, _lodash.get)(JSON.parse(config), 'globalConfig.coverageThreshold.global');
}

function splitResults() {
    var results = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return results.split(/\r?\n/);
}

function getLastLines() {
    var results = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var resultsList = splitResults(results);
    return (0, _lodash.takeRight)((0, _lodash.compact)(resultsList), count);
}

function matchLine() {
    var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var line = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return line.match(str);
}

function findFailures() {
    var thresholds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var lines = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    return thresholds.map(function (threshold) {
        var matchString = HEAD_STRING + ' ' + threshold;
        var appliedMatchLine = (0, _lodash.partial)(matchLine, matchString);
        var index = (0, _lodash.findIndex)(lines, appliedMatchLine);
        return index > -1 ? { threshold: threshold, failure: lines[index] } : false;
    }).filter(function (failure) {
        return failure;
    });
}

function validate() {
    var fail = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Function;
    var pass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Function;

    var config = (0, _child_process.spawnSync)(commands.base, commands.showConfig).stderr.toString();
    var results = (0, _child_process.spawnSync)(commands.base, commands.coverage).stderr.toString();
    var thresholdList = Object.keys(getThresholds(config));
    var potentialFailures = getLastLines(results, thresholdList.length);
    var failures = findFailures(thresholdList, potentialFailures);

    return failures.length > 0 ? fail(failures) : pass(true);
}