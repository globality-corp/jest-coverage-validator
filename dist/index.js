'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validate = validate;

var _utils = require('./utils');

function validate() {
    var fail = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Function;
    var pass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Function;
    // eslint-disable-line
    var config = (0, _utils.appliedGetStderr)(_utils.commands.showConfig);
    var results = (0, _utils.appliedGetStderr)(_utils.commands.coverage);
    var thresholdList = Object.keys((0, _utils.getThresholds)(config));
    var potentialFailures = (0, _utils.getLastLines)(results, thresholdList.length);
    var failures = (0, _utils.findFailures)(thresholdList, potentialFailures);

    return failures.length > 0 ? fail(failures) : pass(true);
}