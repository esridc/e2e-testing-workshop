const assert = require('assert');
import Google from '../pages/google.page';


describe('Google Search:', function () {
  
  it('should have global nav', function () {
    // Get the url based on the location we are running in...   XcAdStQsCT78
    Umbrella.open(Artifactory.appUrl);
    // verify we have the global nav bar...
    GlobalNav.verify(expect);
  });
});


describe('Esri DevSummit Google Search', () => {
  it('results should have correct titles and url', () => {
      Google.open()
      Google.executeSearch('esri devsummit workshops')

      const listingHeaderTexts = Google.getListingHeaders();

      assert.equal(listingHeaderTexts[0], 'Pre-Summit Hands-On Training | 2020 Esri Developer Summit', 'First listing has correct title');
      assert.equal(listingHeaderTexts[1], 'Agenda | 2020 Esri Developer Summit', 'Second listing has correct title');
      assert.equal(listingHeaderTexts[2], '2019 Esri Developer Summit: January 31, Washington, D.C.', 'Third listing has correct title');

      Google.clickFirstResult();

      assert.equal(browser.getUrl(), 'https://www.esri.com/en-us/about/events/devsummit/agenda/pre-summit-hands-on-training', 'Dev summit training page has correct URL');
  });
});