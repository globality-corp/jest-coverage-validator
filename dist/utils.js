'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.appliedGetStderr = exports.HEAD_STRING = exports.commands = undefined;
exports.getThresholds = getThresholds;
exports.splitResults = splitResults;
exports.getLastLines = getLastLines;
exports.matchLine = matchLine;
exports.findFailures = findFailures;
exports.getStderr = getStderr;

var _child_process = require('child_process');

var _lodash = require('lodash');

var commands = exports.commands = {
    base: 'jest',
    coverage: ['--coverage', '--maxWorkers', '4', '--json'],
    showConfig: ['--showConfig', '--json']
};

var HEAD_STRING = exports.HEAD_STRING = 'Jest: Coverage for';

function getThresholds() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return (0, _lodash.get)(JSON.parse(config), 'globalConfig.coverageThreshold.global');
}

function splitResults() {
    var results = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return results.split(/\r?\n/);
}

function getLastLines() {
    var results = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
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

function getStderr(base, command) {
    return (0, _child_process.spawnSync)(base, command).stderr.toString();
}

var appliedGetStderr = exports.appliedGetStderr = (0, _lodash.partial)(getStderr, commands.base);