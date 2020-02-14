# Testing Google Search Results

## Setup
- Same Webdriver.IO setup from last exercise.
- Define a new test `google-search.js`:
```javascript
const assert = require('assert');

describe('Esri DevSummit Google Search', () => {
    it('should display correct titles for the first three listings', () => {

    });
});
```
- Now let's define some constants.
```javascript
// it(...
    const url = 'https://google.com';
    const searchText = 'esri devsummit workshops';
// );
```

- Just like in the last example, we'll use the `browser.url()` function to navigate the browser to the start URL. What we have so far:
```javascript
const url = 'https://google.com';
const searchText = 'esri devsummit workshops';

browser.url(url);
```

- Time to run the project and see where we're at.
  - `npm i`
  - add a convenience script into `package.json`
  ```json
  scripts: {
    "test": "./node_modules/.bin/wdio wdio.conf.js"
  }
  ```
  - `npm test`
  - Result: we see a flash of `http://google.com`


## Entering Text into Search Bar
### Getting a Ref with a Selector
- What is the first step to searching Google? Answer: we want our test to enter the `searchText` we defined into Google's search field.
  - WDIO needs a way to locate the elements we want to interact with. Solution: selectors.
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
  const url = 'https://google.com';
  const searchText = 'esri devsummit workshops';

  browser.url(url);

  const searchBarEl = $(SELECTORS.SEARCH_BAR);
  ```
  - You may recognize the `$` selector function from JQuery syntax.
  - Now, we need wait to make sure the search bar has loaded before we enter our search text:
  ```javascript
  searchBarEl.waitForDisplayed();
  ```

### Setting the Value
  - How do we set the value of this element? Well, you know from developing for the web that you can just assign a string to the value property of an element, right? Let's try it:
  ```javascript
  const searchBarEl = $(SELECTORS.SEARCH_BAR);
  searchBarEl.waitForDisplayed();
  searchBarEl.value = searchText;
  ```

  - `npm test`
  - It didn't work? Why? Key point -> the elements we interact with in Webdriver.IO _aren't real DOM elements_. They're abstractions defined by Webdriver.IO to make communication with the browser through the webdriver protocol simpler. So, we have to follow Webdriver.IO's API docs, not the stuff you find on MDN. Let's try again using WDIO's [element.setValue()](https://webdriver.io/docs/api/element/setValue.html):

  ```javascript
  const searchBarEl = $(SELECTORS.SEARCH_BAR);
  searchBarEl.waitForDisplayed();
  searchBarEl.setValue(searchText);
  ```
  - `npm test` (Works!)

## Trigger Search
- So we have our text being entered in the right place. Now what?
- We need to trigger a search.

    - We have options:

      1. Click search button
      2. "Press" enter
    - Let's go with option 2 because it's simplest. The only draw back is that the button could break and our test wouldn't catch it.

- Add Keys registry

```javascript
const KEYS = {
  ENTER: '\uE007'
};

// describe(...);
```

- Use `browser.keys`
```javascript
browser.keys(KEYS.ENTER); // "Press" enter to search
```

## Examine the listing titles
- Need a selector for the listings. We want to examine the titles of the top three, so we need one that will suffice for all the listings.
- `#search .g a h3`
- Need to get the text from each h3 element.
- `const listingHeaderTexts = $$(SELECTORS.ORGANIC_LISTING_HEADERS).map(el => el.getText());`
- Notice the use of `$$` to select multiple elements whereas `$` would have selected only the first.
- Now it's time to make some assertions:
```javascript
assert.equal(listingHeaderTexts[0], 'Pre-Summit Hands-On Training | 2020 Esri Developer Summit', 'First listing has correct title');
assert.equal(listingHeaderTexts[1], 'Agenda | 2020 Esri Developer Summit', 'Second listing has correct title');
assert.equal(listingHeaderTexts[2], '2019 Esri Developer Summit: January 31, Washington, D.C.', 'Third listing has correct title');
```

## Final assertion: Verify the URL of the first page
  - Add selector:
  ```javascript
  SELECTORS = {
    ...
    ORGANIC_LISTING_LINKS: '#search .g a',
  }
  ```
  ```javascript
  const firstListingHeaderLink = $(SELECTORS.ORGANIC_LISTING_LINKS);
  firstListingHeaderLink.click();
  ```
  - Notice the use of `$` to only select the first element on the page matching our selector.
  - And finally, we assert the URL:
  ```javascript
  assert.equal(browser.getUrl(), 'https://www.esri.com/en-us/about/events/devsummit/agenda/pre-summit-hands-on-training', 'Dev summit training page has correct URL');
  ```
  - Notice that we can pass a third string to `assert.equal` (and most other assertion functions) to add descriptive error messaging.

## Final Code
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
        const searchText = 'esri devsummit workshops';

        browser.url(url);

        const searchBarEl = $(SELECTORS.SEARCH_BAR);
        searchBarEl.waitForDisplayed();
        searchBarEl.setValue(searchText);
        browser.keys(KEYS.ENTER); // "Press" enter to search

        const listingHeaderTexts = $$(SELECTORS.ORGANIC_LISTING_HEADERS).map(el => el.getText());

        assert.equal(listingHeaderTexts[0], 'Pre-Summit Hands-On Training | 2020 Esri Developer Summit', 'First listing has correct title');
        assert.equal(listingHeaderTexts[1], 'Agenda | 2020 Esri Developer Summit', 'Second listing has correct title');
        assert.equal(listingHeaderTexts[2], '2019 Esri Developer Summit: January 31, Washington, D.C.', 'Third listing has correct title');

        const firstListingHeaderLink = $(SELECTORS.ORGANIC_LISTING_LINKS);
        firstListingHeaderLink.click();

        assert.equal(browser.getUrl(), 'https://www.esri.com/en-us/about/events/devsummit/agenda/pre-summit-hands-on-training', 'Dev summit training page has correct URL');
    });
});
```