const assert = require('assert');

const SELECTORS = {
  SIKH_OPTION: 'option[value="Sikh"]'
};

describe('Cluster map', () => {
    it('should look correct on page load', () => {
      const url = 'https://developers.arcgis.com/javascript/latest/sample-code/featurereduction-cluster-filter/live/index.html';
      browser.url(url);

      browser.pause(4000); // wait for map to load. DON'T rely on this in production

      assert.equal(browser.checkScreen('map-screen'), 0);
    });

    it('Sikh clusters should look correct', () => {
      const url = 'https://developers.arcgis.com/javascript/latest/sample-code/featurereduction-cluster-filter/live/index.html';
      browser.url(url);

      browser.pause(4000); // wait for map to load. DON'T rely on this in production

      $(SELECTORS.SIKH_OPTION).click();

      assert.equal(browser.checkScreen('map-screen-sikh'), 0);
    });
});