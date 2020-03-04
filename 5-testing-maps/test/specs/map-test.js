const assert = require('assert');

describe('Cluster map', () => {
    it('should look correct on page load', () => {
      const url = 'https://developers.arcgis.com/javascript/latest/sample-code/featurereduction-cluster-filter/live/index.html';
      browser.url(url);

      browser.pause(4000);

      assert.equal(browser.checkScreen('map-screen'), 0);
    });
});