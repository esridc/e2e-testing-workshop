const assert = require('assert');

const SELECTORS = {
    SEARCH_BAR: 'input[title="Search"]',
    SEARCH_BUTTON: 'input[value="Google Search"]',
    ORGANIC_LISTING_HEADERS: '#search .g a h3',
    ORGANIC_LISTING_LINKS: '#search .g a',
};

const AGENDA = {
  AGENDA_DROP_DOWN: 'li.es-nav-subitem:nth-child(2) > a',
  WORKSHOP_LINK: 'li.es-nav-subitem:nth-child(2) > div > ul > li:nth-child(3) > a',
  SESSION_ENTRY: '.event-detail:nth-child(6)',
  SESSION_NEXT_ENTRY: '.event-detail:nth-child(7)',
  SESSION_ENTRY_TITLE: '.event-detail:nth-child(6) h3'
}

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

    assert.equal(listingHeaderTexts[0], '2020 Esri Developer Summit: March 10-13 in Palm Springs, CA', 'First listing has correct title');
    assert.equal(listingHeaderTexts[1], 'Agenda | 2020 Esri Developer Summit', 'Second listing has correct title');
    assert.equal(listingHeaderTexts[2], 'Call for Presentations | 2020 DevSummit, Palm Spring ... - Esri', 'Third listing has correct title');

    const firstListingHeaderLink = $(SELECTORS.ORGANIC_LISTING_LINKS);
    firstListingHeaderLink.click();

    assert.equal(browser.getUrl(), 'https://www.esri.com/en-us/about/events/devsummit/overview', 'Dev Summit page');
    
    // click the agenda on nav bar to open it
    $(AGENDA.AGENDA_DROP_DOWN).click();
    // now click the workshop link
    $(AGENDA.WORKSHOP_LINK).click();

    assert.equal(browser.getUrl(), 'https://www.esri.com/en-us/about/events/devsummit/agenda/pre-summit-hands-on-training', 'Dev Summit workshops page');

    // scroll to the footer to get everything into the DOM
    $('#globalfooter').scrollIntoView();
    $(AGENDA.SESSION_ENTRY_TITLE).waitForClickable({timeout:1000});

    // find the workshop
    assert.equal($(AGENDA.SESSION_ENTRY_TITLE).getText(), 'End-to-End Testing for Javascript Applications [ONE DAY]');
  });
});
