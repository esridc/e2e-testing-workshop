import KEYS from '../utils/keys';
import BasePage from './base-page';
class GoogleSearchPage extends BasePage{
  constructor () {
    super();
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
    browser.keys(KEYS.ENTER); // "Press" enter to search
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