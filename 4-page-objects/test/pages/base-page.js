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
   * Verify the url is what we
   * @param {function} assert Assert function
   */
  verifyUrl (assert) {
    let currentUrl = browser.getUrl();
    assert.equal(currentUrl, this.url, `current url should be ${this.url}`);
  }

}
