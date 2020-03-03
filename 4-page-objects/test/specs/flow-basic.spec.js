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