## Prerequisites
- Node.JS at least v8.11.2 or higher (I used v8.16.0)
- JDK (https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

## Set up Project
- create a root directory named "e2e-testing-workshop" `mkdir e2e-testing-workshop`
- navigate into that directory `cd e2e-testing-workshop`
- create a subdirectory named "1-wdio-starter" `mkdir 1-wdio-starter`
- navigate into that subdirectory `cd 1-wdio-starter`
- `npm init -y`
- `npm i --save-dev @wdio/cli`
- `./node_modules/.bin/wdio config`
  - Where should your tests be launched? `local`
  - Where is your automation backend located? `On my local machine`
  - Which framework do you want to use? `mocha`
  - Do you want to run WebdriverIO commands synchronous or asynchronous? `sync`
  - Where are your test specs located? `Press Enter`
  - Which reporter do you want to use? `spec`
  - Do you want to add a service to your test setup? deselect `chromedriver`, select `selenium-standalone` (this will allow us to run tests on multiple browsers instead of just Chrome)
  - What is the base url? `Press Enter`
- `mkdir -p ./test/specs`
- `touch ./test/specs/basic.js`

Insert the following into `./test/specs/basic.js`:
```
const assert = require('assert');

describe('webdriver.io page', () => {
    it('should have the right title', () => {
        browser.url('https://webdriver.io');
        const title = browser.getTitle();
        assert.strictEqual(title, 'WebdriverIO · Next-gen WebDriver test framework for Node.js');
    });
});
```

- run `./node_modules/.bin/wdio wdio.conf.js`
