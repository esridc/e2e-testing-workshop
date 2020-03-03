# Webdriver Selectors

In this exercise we will conduct a search at Google.com, inspect the results - verifying expected text content, and the url of the first result.

## Setup
Same Webdriver.IO setup from last exercise:
  - navigate to the root directory `e2e-testing-workshop`
  - create a subdirectory named "2-google-test" `mkdir 2-google-test`
  - navigate into that subdirectory `cd 2-google-test`
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

Or you can continue working in the previous folder

### Add a Test

- Define a new test `touch ./test/specs/google-search.js`
- Insert the following into `./test/specs/google-search.js`:
```javascript
const assert = require('assert');

describe('Esri DevSummit Google Search', () => {
    it('should display correct titles for the first three listings', () => {

    });
});
```

- Now let's define some constants in the `it()` block.
```javascript
// it(...
    const url = 'https://google.com';
    const searchText = 'esri devsummit 2020';
// );
```

- Just like in the last example, we'll use the `browser.url()` function to navigate the browser to the start URL. What we have so far:
```javascript
// it(...
const url = 'https://google.com';
const searchText = 'esri devsummit 2020';

browser.url(url);
// }:
```

### Automating Google

Time to run the project and see where we're at.
  - `npm i`
  - add a convenience script into `package.json` so we're not typing that long command all the time

  ```json
  "scripts": {
    "test": "./node_modules/.bin/wdio wdio.conf.js"
  }
  ```

  - `npm test`
  - Result: we see a flash of `http://google.com` and a passed test result in our terminal


## Entering Text into Search Bar

### Getting a Reference to an Element with a Selector

What is the first step to searching Google? Answer: we want our test to enter the `searchText` we defined into Google's search field. WDIO needs a way to locate the elements we want to interact with. Solution: selectors.

  - Open `http://google.com` in Google Chrome.
  - Right click (ctrl + click on macs) the search field and select `Inspect Element`
  - What distinctive features (CSS classes or HTML attributes) do you see?
    - `input[title="Search"]`
  - Define a registry of selector strings above the `describe` block (creating a registry makes sense since we anticipate that we will need more than just this one as we build out the test):

  ```javascript
  const SELECTORS = {
    SEARCH_BAR: 'input[title="Search"]'
  };

  // describe(...)
  ```
  - Add code to get a reference to the actual element:
  ```javascript
  // it(...
  const url = 'https://google.com';
  const searchText = 'esri devsummit 2020';

  browser.url(url);

  const searchBarEl = $(SELECTORS.SEARCH_BAR);
  // };
  ```
  
  - You may recognize the `$` selector function from JQuery syntax... it's like that but with more super powers.

  - Now, we need wait to make sure the search bar has loaded before we enter our search text:

  ```javascript
  searchBarEl.waitForDisplayed();
  ```

### Setting the Value
  
  How do we set the value of this element? Well, you know from developing for the web that you can just assign a string to the value property of an element, right? Let's try it:

  ```javascript
  const searchBarEl = $(SELECTORS.SEARCH_BAR);
  searchBarEl.waitForDisplayed();
  searchBarEl.value = searchText;
  ```

  - `npm test`

  ### Webdriver.io Elements !== DOM Elements
  It didn't work? Why? Key point -> the elements we interact with in Webdriver.IO _aren't real DOM elements_. They're abstractions defined by Webdriver.IO to make communication with the browser through the webdriver protocol simpler. So, we have to follow Webdriver.IO's API docs, not the stuff you find on MDN. Let's try again using WDIO's [element.setValue()](https://webdriver.io/docs/api/element/setValue.html):

  ```javascript
  const searchBarEl = $(SELECTORS.SEARCH_BAR);
  searchBarEl.waitForDisplayed();
  searchBarEl.setValue(searchText);
  ```
  - `npm test` (Works!)

## Trigger Search
So we have our text being entered in the right place. Now what? We need to trigger a search.

- We have options:

  1. Click search button
  2. "Press" enter
- Let's go with option 2 because it's simplest. The only draw back is that the button could break and our test wouldn't catch it.

### Add Keys registry

While we don't technically need to use a "registry", odds are good that we may have more than one special key code to send. Again, above the `describe` block we add a constant...

```javascript
const KEYS = {
  ENTER: '\uE007'
};

// describe(...);
```

- Then in our `it` we use `browser.keys` to send `ENTER`. Key thing here is that by using `.setValue` the focus in the browser is the input, so this will work.


```javascript
browser.keys(KEYS.ENTER); // "Press" enter to search
```

- `npm test` 
- we should see a search results listing just before chrome closes.


## Examine the listing titles

Need a selector for the listings. We want to examine the titles of the top three, so we need one that will suffice for all the listings.

- Add selector:
  ```javascript
    SELECTORS = {
      ...
      ORGANIC_LISTING_HEADERS: '#search .g a h3',
    }
  ```
- Need to get the text from each h3 element.
- `const listingHeaderTexts = $$(SELECTORS.ORGANIC_LISTING_HEADERS).map(el => el.getText());`
- Notice the use of `$$` to select multiple elements whereas `$` would have selected only the first.
- Now it's time to make some assertions:

```javascript
assert.equal(listingHeaderTexts[0], '2020 Esri Developer Summit: March 10-13 in Palm Springs, CA', 'First ok');
assert.equal(listingHeaderTexts[1], 'Agenda | 2020 Esri Developer Summit', 'Second ok');
assert.equal(listingHeaderTexts[2], 'Call for Presentations | 2020 DevSummit, Palm Spring ... - Esri', 'Third ok');

```

## Final assertion: Verify the URL of the first result
Again, we add a selector

  ```js
  SELECTORS = {
    ...
    ORGANIC_LISTING_LINKS: '#search .g a',
  }
  ```

Then use it in our test code
  ```javascript
  const firstListingHeaderLink = $(SELECTORS.ORGANIC_LISTING_LINKS);
  firstListingHeaderLink.click();
  ```
  - Notice the use of `$` to only select the first element on the page matching our selector.
  - And finally, we assert the URL:

  ```javascript
  assert.equal(browser.getUrl(), 'https://www.esri.com/en-us/about/events/devsummit/overview', 'Dev Summit page');
  ```
  - Notice that we can pass a third string to `assert.equal` (and most other assertion functions) to add descriptive error messaging.

## Entire Test File
```javascript
const assert = require('assert');

const SELECTORS = {
    SEARCH_BAR: 'input[title="Search"]',
    SEARCH_BUTTON: 'input[value="Google Search"]',
    ORGANIC_LISTING_HEADERS: '#search .g a h3',
    ORGANIC_LISTING_LINKS: '#search .g a',
};

const KEYS = {
    ENTER: '\uE007'
};

describe('Esri DevSummit Google Search', () => {
  it('results should have correct titles and url', () => {
    const url = 'https://google.com';
    const searchText = 'esri devsummit 2020';

    browser.url(url);

    const searchBarEl = $(SELECTORS.SEARCH_BAR);
    searchBarEl.waitForDisplayed();
    searchBarEl.setValue(searchText);
    browser.keys(KEYS.ENTER); // "Press" enter to search

    const listingHeaderTexts = $$(SELECTORS.ORGANIC_LISTING_HEADERS).map(el => el.getText());

    // Note: The exact order of these results may vary 
    // This exercise is meant to show the use of webdriver selectors vs testing consistent
    // result ordering by Google
    assert.equal(listingHeaderTexts[0], '2020 Esri Developer Summit: March 10-13 in Palm Springs, CA', 'First ok');
    assert.equal(listingHeaderTexts[1], 'Agenda | 2020 Esri Developer Summit', 'Second ok');
    assert.equal(listingHeaderTexts[2], 'Call for Presentations | 2020 DevSummit, Palm Spring ... - Esri', 'Third ok');

    const firstListingHeaderLink = $(SELECTORS.ORGANIC_LISTING_LINKS);
    firstListingHeaderLink.click();

    assert.equal(browser.getUrl(), 'https://www.esri.com/en-us/about/events/devsummit/overview', 'Dev Summit page');
  });
});
```
