# Jest Coverage Validator
Validates Jest test coverage thresholds to be sure your coverage doesn't decrease. Executes a supplied `pass` or `fail` function.

Use this during CI or other build processes.

Use it alongside something like [jest-coverage-ratchet](https://www.npmjs.com/package/jest-coverage-ratchet).

Pass in a `fail` function to:
- Fail a build
- Send a Slack message
- Etc.

Simple API:

```
// ci-coverage-validate.js
const validate = require('jest-coverage-validator');

function fail (failures) {
    global.console.error('Code coverage does not meet minimum threshold.');
    global.console.error('Failures: ', failures);
    process.exit(1);
}

function pass () {
    global.console.log('Yay, code coverage didn\'t go down!');
    process.exit(0);
}

validate(fail, pass);
```

- `fail` is called with a list of failed thresholds.
- `pass` is called with `true` if no thresholds fail.
