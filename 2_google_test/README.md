# Testing Google Search Results

- Same setup from last exercise.
- Define a new test `google-search.js`:
```
describe('Esri DevSummit Google Search', () => {
    it('should display correct titles for the first three listings', () => {

    });
});
```
- Now let's do some setup.
```
it(...
    const url = 'https://google.com';
    const searchText = 'esri devsummit workshops';
);
```

- Just like in the last example, we'll use the `browser.url()` function to navigate the browser to the start URL. What we have so far:
```
const url = 'https://google.com';
const searchText = 'esri devsummit workshops';

browser.url(url);
```

- Time to run the project and see where we're at.
  - `npm i`
  - add a convenience script into `package.json`
  ```
  scripts: {
    "test": "./node_modules/.bin/wdio wdio.conf.js"
  }
  ```
  - `npm test`
  - Result: we see a flash of `http://google.com`


- What is the first step to searching Google? Answer: we want our test to enter the `searchText` we defined into Google's search field.
  - WDIO needs a way to locate the elements we want to interact with. Solution: selectors.
  - Open `http://google.com` in Google Chrome.
  - Right click (ctrl + click on macs) the search field and select `Inspect Element`
  - What distinctive features (CSS classes or HTML attributes) do you see?
    - `input[title="Search"]`
  - Define a registry of selector strings above the `describe` block (we anticipate that we will need more than just this one to complete the test):
  ```
  const SELECTORS = {
    SEARCH_BAR: 'input[title="Search"]'
  };

  describe(...)
  ```
  - Add code to get a reference to the actual element:
  ```
  const url = 'https://google.com';
  const searchText = 'esri devsummit workshops';

  browser.url(url);

  const searchBarEl = $(SELECTORS.SEARCH_BAR);
  ```
  - You may recognize the `$` selector function from JQuery syntax.
  - Now, we need wait to make sure the search bar has loaded before we enter our search text:
  ```
  searchBarEl.waitForDisplayed();
  ```

  - How do we set the value of this element? Well, you know from developing for the web that you can just assign a value to the value property of an element, right? Let's try it:
  ```
  const searchBarEl = $(SELECTORS.SEARCH_BAR);
  searchBarEl.waitForDisplayed();
  searchBarEl.value = searchText;
  ```

  - `npm test`
  - WHAT? An error? Why? It works in the browser! Key point -> the elements we interact with in Webdriver.IO _aren't real DOM elements_. They're abstractions defined by Webdriver.IO to make communication with the browser through the webdriver protocol simpler. So, we have to follow Webdriver.IO's API docs, not the stuff you find on MDN. Let's try again:

  ```
  const searchBarEl = $(SELECTORS.SEARCH_BAR);
  searchBarEl.waitForDisplayed();
  searchBarEl.setValue(searchText);
  ```
  - `npm test`



