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