

class GoogleSearchPage {
  constructor () {
    super();
  }
  
  open() {
    browser.url('https://google.com');
  }

  // Selectors
  get searchBar () { return $('input[title="Search"]'); }
  get searchButton () { return $('input[value="Google Search"]'); }
  get listingHeaders () { return $$('#search .g a h3'); }
  get listingLinks () { return $('#search .g a'); }

  // Actions
  executeSearch(searchText) {
    this.searchBar.setValue(searchText);
    this.searchButton.click();
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