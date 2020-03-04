# Page Objects

At this point we've covered a lot of ground in terms of working with Webdriver, but we've piled all the code into one spec, and that is clearly not going to scale up or be maintainable. So it's time to bring some struture to our test project.

The first thing we will do is leverage the [Page Object Pattern](https://webdriver.io/docs/pageobjects.html) to separate things out a bit. From the documentation...

> The goal of using page objects is to abstract any page-specific information away from the actual tests. Ideally, you should store all selectors or specific instructions that are unique for a certain page in a page object, so that you still can run your test after you've completely redesigned your page.

## Setup
We are going to be refactoring the previous state of things, so you can keep working in that same folder, or create a new folder `4-page-objects` and re-do the [Setup](../2-google-test/README.md) again.

## Create a `pages` folder

Part of the goal is to separate the "test logic" from the "page logic" so we will create a `tests/pages` folder to hold our page objects, and `touch` a new file to create it. You could also create the file in your editor.

```
$ mkdir tests/pages
$ touch test/pages/google.page.js
```


### Google Search Page
We'll start by moving the Google selectors etc into a class


```js
// tests/pages/google.page.js
class GoogleSearchPage {
  constructor () {
    this.url = 'https://google.com';
  }

  open() {
    browser.url(this.url);
  }

  // Selectors
  get searchBar () { return $('input[title="Search"]'); }
  get listingHeaders () { return $$('#search .g a h3'); }
  get listingLinks () { return $('#search .g a'); }

  // Actions
  executeSearch(searchText) {
   this.searchBar.waitForDisplayed();
    this.searchBar.setValue(searchText);
    browser.keys('\uE007'); // "Press" enter to search
  }

  getListingHeaders () {
    return this.listingHeaders.map(el => el.getText());
  }

  clickFirstResult () {
    return this.listingLinks.click();
  }
}
// export an instance
export default new GoogleSearchPage();

```


Then create the `tests/specs/google-search.spec.js` file, and can import the page and greatly streamline things

```js
const assert = require('assert');
import GoogleSearchPage from '../pages/google.page';


describe('Esri DevSummit Google Search', () => {
  it('results should have correct titles and url', () => {
    
    GoogleSearchPage.open()
    // we've abstracted out all the selectors here
    // so another spec could reuse the google.page
    GoogleSearchPage.executeSearch('esri devsummit 2020')

    const listingHeaderTexts = GoogleSearchPage.getListingHeaders();

    assert.equal(listingHeaderTexts[0], '2020 Esri Developer Summit: March 10-13 in Palm Springs, CA', 'First listing has correct title');
    assert.equal(listingHeaderTexts[1], 'Agenda | 2020 Esri Developer Summit', 'Second listing has correct title');
    assert.equal(listingHeaderTexts[2], 'Call for Presentations | 2020 DevSummit, Palm Spring ... - Esri', 'Third listing has correct title');

    GoogleSearchPage.clickFirstResult();

    assert.equal(browser.getUrl(), 'https://www.esri.com/en-us/about/events/devsummit/overview', 'Dev Summit Overview');
  });
});
```

We have 2 other pages, so let's do the same sort of abstraction for them:
- create `test/pages/overview.page.js`
- create `test/pages/workshops.page.js`

And while we're at it, lets create a util for the KEYS so that's less aweful

create `test/utils/keys.js`

### keys.js

```js
export default {
  ENTER: '\uE007'
};
```

and import that into the `google.page.js` file

```js
...
import KEYS from '../utils/keys';
...
// then use it in execute search
executeSearch(searchText) {
  this.searchBar.waitForDisplayed();
  this.searchBar.setValue(searchText);
  browser.keys(KEYS.ENTER); // "Press" enter to search
}

```

### Overview Page

```js
class OverviewPage {
  constructor () {
    this.url = 'https://www.esri.com/en-us/about/events/devsummit/overview';
  }

  open() {
    browser.url(this.url);
  }

  // Selectors
  get navAgendaDropDown () { return $('li.es-nav-subitem:nth-child(2) > a'); }
  get navWorkshopLink () { return $('li.es-nav-subitem:nth-child(2) > div > ul > li:nth-child(3) > a'); }

  // abstract more details from spec
  verifyUrl (assert) {
    let currentUrl = browser.getUrl();
    assert.equal(currentUrl, this.url, `current url should be ${this.url}`);
  }

}
// export an instance
export default new OverviewPage();
```

### Workshops Page

```js
class WorkshopsPage {
  constructor () {
    this.url = 'https://www.esri.com/en-us/about/events/devsummit/agenda/pre-summit-hands-on-training';
  }

  open() {
    browser.url(this.url);
  }

  // Selectors
  get navAgendaDropDown () { return $('li.es-nav-subitem:nth-child(2) > a'); }
  get navWorkshopLink () { return $('li.es-nav-subitem:nth-child(2) > div > ul > li:nth-child(3) > a'); }

  get globalFooter () { return $('#globalfooter'); }
  get listingLinks () { return $('.event-detail:nth-child(6) h3'); }
  // abstract more details from spec
  verifyUrl (assert) {
    let currentUrl = browser.getUrl();
    assert.equal(currentUrl, this.url, `current url should be ${this.url}`);
  }
}
// export an instance
export default new WorkshopsPage();
```

## Updating the Spec

Let's update our spec to use these new Page objects

```js
const assert = require('assert');
// Import the pages...
import GoogleSearchPage from '../pages/google.page';
import OverviewPage from '../pages/overview.page';
import WorkshopsPage from '../pages/workshops.page';


describe('Esri DevSummit Google Search', () => {
  it('results should have correct titles and url', () => {
    GoogleSearchPage.open()
    // we've abstracted out all the selectors here
    // so another spec could reuse the google.page
    GoogleSearchPage.executeSearch('esri devsummit 2020')

    const listingHeaderTexts = GoogleSearchPage.getListingHeaders();

    assert.equal(listingHeaderTexts[0], '2020 Esri Developer Summit: March 10-13 in Palm Springs, CA', 'First listing has correct title');
    assert.equal(listingHeaderTexts[1], 'Agenda | 2020 Esri Developer Summit', 'Second listing has correct title');
    assert.equal(listingHeaderTexts[2], 'Call for Presentations | 2020 DevSummit, Palm Spring ... - Esri', 'Third listing has correct title');

    GoogleSearchPage.clickFirstResult();
    // Use the Overview page to verify that we ended up in the right place
    OverviewPage.verifyUrl(assert);
    // now use it's selectors to navigate
    OverviewPage.navAgendaDropDown.click();
    OverviewPage.navWorkshopLink.click();
    // now verify we are on the workshops page
    WorkshopsPage.verifyUrl(assert);
  });
});
```


### Running our new Tests

Before we can run these, we need to tell node how to handle ES6 imports etc. This involves setting up `babel`. The [Webdriver.io documentation](https://webdriver.io/docs/babel.html) has more details about this, but this will get us up and running.

```sh
$ npm install --save-dev @babel/core @babel/cli @babel/preset-env @babel/register
```

Then we have to create a `babel.config.js` file in the `4-page-objects` folder

```js
module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 12
      }
    }]
  ]
}

```

And finally, tell Webdriver to use this. In `wdio.conf.js` locate the `mochaOpts` section and edit it to look like this

```js
  mochaOpts: {
    ui: 'bdd',
    timeout: 6000, // when debugging, bumping this up to 120000 can be really helpful
    require: ['@babel/register']
  },
```




### Refactoring to a BasePage Class

All our pages have a `verifyUrl` function, lets hoist that into a base page class to keep things "DRY"

```js
export default class BasePage {
  constructor () {
    this.title = 'Page';
  }

  /**
   * Open a Url
   * @param {string} path Url to open
   */
  open (path) {
    browser.url(path);
  }

  /**
   * Verify the url is what we expect
   * @param {function} assert Assert function
   */
  verifyUrl (assert) {
    let currentUrl = browser.getUrl();
    assert.equal(currentUrl, this.url, `current url should be ${this.url}`);
  }
}
```

We need to update the other page's to import the BasePage and extend from it. This is the pattern to apply to all three page files

```js
import BasePage from './base-page';
class ThePage extends BasePage{
  constructor () {
    super();
    this.url = 'whatever the url is';
  }
  ...
  // delete the verifyUrl function
  ...
}
```


### Extracting Components

Our page objects for the DevSummit pages share the nav selectors, and if we were to add more test for other pages, odds are we'd need more navigation options so let's hoist that out into a component.


```js

class DevSummitNav {

  // Selectors for the entries in the nav
  get navOverviewLink () { return $('li.es-nav-subitem:nth-child(1) > a'); }
  // this is not the entire nav...
  get navAgendaDropDown () { return $('li.es-nav-subitem:nth-child(2) > a'); }
  get navAgendaAgendaLink () { return $('li.es-nav-subitem:nth-child(2) > div > ul > li:nth-child(1) > a'); }
  get navAgendaKeynoteLink () { return $('li.es-nav-subitem:nth-child(2) > div > ul > li:nth-child(2) > a'); }
  get navAgendaWorkshopLink () { return $('li.es-nav-subitem:nth-child(2) > div > ul > li:nth-child(3) > a'); }

  // Open the drop-down
  openDropdown (name) {
    switch (name) {
      case 'overview':
        this.navOverviewLink.click();
        break;
      case 'agenda':
        this.navAgendaDropDown.click();
        break;
    }
  }
  // Click links
  clickLink (name) {
    switch (name) {
      case 'overview':
        this.navOverviewLink.click();
        break;
      case 'agenda:agenda':
        this.navAgendaAgendaLink.click();
        break;
      case 'agenda:keynote':
        this.navAgendaKeynoteLink.click();
        break;
      case 'agenda:workshops':
        this.navAgendaWorkshopLink.click();
        break;
    }
  }

}
// export an instance
export default new DevSummitNav();
```




### Overview Page updated with DevSummitNav Component

```js
import BasePage from './base-page';
import DevSummitNav from '../components/devsummit-nav';
class OverviewPage extends BasePage{
  constructor () {
    super();
    this.url = 'https://www.esri.com/en-us/about/events/devsummit/overview';
  }

  open() {
    browser.url(this.url);
  }

  // leverage the helpers
  openAgenda() {
    DevSummitNav.openDropdown('agenda');
    DevSummitNav.clickLink('agenda:workshops');
  }


}
// export an instance
export default new OverviewPage();
```

### Workshop Page updated with DevSummitNav Component

```js
import BasePage from './base-page';
import DevSummitNav from '../components/devsummit-nav';
class WorkshopsPage extends BasePage {
  constructor () {
    super();
    this.url = 'https://www.esri.com/en-us/about/events/devsummit/agenda/pre-summit-hands-on-training';
  }

  open() {
    browser.url(this.url);
  }

  // Page specific selectors
  get globalFooter () { return $$('#globalfooter'); }
  get listingLinks () { return $('.event-detail:nth-child(6) h3'); }

  // Delegate the Selectors
  get navAgendaDropDown () { return DevSummitNav.navAgendaDropDown; }
  get navWorkshopLink () { return DevSummitNav.navAgendaWorkshopLink }

  // or leverage the helpers
  openOverview() {
    DevSummitNav.clickLink('overview');
  }
  // add a helper to get a session title
  getSessionTitle(entryNumber) {
    this.globalFooter.scrollIntoView();
    const targetEl = $(`.event-detail:nth-child(${entryNumber}) h3`);
    targetEl.waitForClickable({timeout:2000});
    return targetEl.getText();
  }

}
// export an instance
export default new WorkshopsPage();
```

### Update our spec

Now we integrate this into the two Pages and update the spec

```js
const assert = require('assert');
import GoogleSearchPage from '../pages/google.page';
import OverviewPage from '../pages/overview.page';
import WorkshopsPage from '../pages/workshops.page';


describe('Esri DevSummit Google Search', () => {
  it('results should have correct titles and url', () => {

    GoogleSearchPage.open()
    // we've abstracted out all the selectors here
    // so another spec could reuse the google.page
    GoogleSearchPage.executeSearch('esri devsummit 2020')

    const listingHeaderTexts = GoogleSearchPage.getListingHeaders();

    assert.equal(listingHeaderTexts[0], '2020 Esri Developer Summit: March 10-13 in Palm Springs, CA', 'First listing has correct title');
    assert.equal(listingHeaderTexts[1], 'Agenda | 2020 Esri Developer Summit', 'Second listing has correct title');
    assert.equal(listingHeaderTexts[2], 'Call for Presentations | 2020 DevSummit, Palm Spring ... - Esri', 'Third listing has correct title');

    GoogleSearchPage.clickFirstResult();
    // Use the Overview page to verify that we ended up in the right place
    OverviewPage.verifyUrl(assert);
    // now use it's selectors to navigate
    OverviewPage.openAgenda();
    // now verify we are on the workshops page
    WorkshopsPage.verifyUrl(assert);
    assert.equal(WorkshopsPage.getSessionTitle(6), 'End-to-End Testing for Javascript Applications [ONE DAY]');
  });
});
```