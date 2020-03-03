import BasePage from './base-page';
import DevSummitNav from '../components/devsummit-nav';
class OverviewPage extends BasePage{
  constructor () {
    super();
    this.url = 'https://www.esri.com/en-us/about/events/devsummit/overview';
  }
  
  open() {
    browser.url(this.url);
  }

  // leverage the helpers
  openAgenda() {
    DevSummitNav.openDropdown('agenda');
    DevSummitNav.clickLink('agenda:workshops');
  }


}
// export an instance
export default new OverviewPage();