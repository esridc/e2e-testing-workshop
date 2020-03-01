/**
 * Base Page
 */
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
   * Simplify Assertions about Url
   * @param {string} expectedUrl THe Url we expect
   * @param {function} expect the expect function
   */
  expectUrlToBe (expectedUrl, expect) {
    let currentUrl = browser.getUrl();
    expect(currentUrl, `current url should be ${expectedUrl}`).to.equal(expectedUrl);
  }

  /**
   * Waits for page to load
   * @param {number} timeout - Amount of time to wait (default 5000 milliseconds)
   * @param {string} pageName - Name of page
   * @param {string} pageSelector - The selector to wait for
   */
  waitForLoad (timeout, pageName, pageSelector) {
    $(pageSelector).waitForDisplayed(timeout,
      false, `page: ${pageName} didn't load within ${timeout} ms`);
  }

  /**
   * Waits for url to change
   * @param {number} timeout - amount of time to wait (default 5000 milliseconds)
   * @param {string} url - url to wait for
   * @param {string} orgType - the type of organization
   */
  waitForUrl (timeout, url) {
    browser.waitUntil(() => browser.getUrl() === url, timeout, `url: ${url} didn't load within ${timeout} ms`);
  }
}
