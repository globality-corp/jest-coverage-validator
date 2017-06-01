# Jest Coverage Validator
Validates Jest test coverage thresholds to be sure your coverage doesn't decrease. Executes a supplied `fail` (and optional `pass`) function after coverage is checked.

Use this during CI or other build processes.

Use it alongside something like [jest-coverage-ratchet](https://www.npmjs.com/package/jest-coverage-ratchet).

### How it works
Two `jest-cli` commands are ran:
- `jest --coverage --json`
- `jest --showConfig --json`

The results are compared against the global thresholds in your Jest config (probably in your `package.json`) to see if your thresholds are not met.

### Simple API

Pass in a `fail` function to `validate` to:
- Fail a build
- Send a Slack message
- Etc.


- `fail` is called with a list of failed thresholds.
- `pass` is called with `true` if no thresholds fail. Optional.


```
\\ circle.yml
...
dependencies:
  cache_directories:
    - ~/.yarn-cache
  override:
    - yarn
    - yarn test
    - node ./ci-coverage-validate.js
    - yarn build
    - docker info
...

// ci-coverage-validate.js
const validate = require('jest-coverage-validator').validate;

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
