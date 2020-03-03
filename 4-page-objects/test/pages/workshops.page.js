import BasePage from './base-page';
import DevSummitNav from '../components/devsummit-nav';
class WorkshopsPage extends BasePage {
  constructor () {
    super();
    this.url = 'https://www.esri.com/en-us/about/events/devsummit/agenda/pre-summit-hands-on-training';
  }
  
  open() {
    browser.url(this.url);
  }

  // Page specific selectors
  get globalFooter () { return $('#globalfooter'); }
  get listingLinks () { return $('.event-detail:nth-child(6) h3'); }

  // Delegate the Selectors
  get navAgendaDropDown () { return DevSummitNav.navAgendaDropDown; }
  get navWorkshopLink () { return DevSummitNav.navAgendaWorkshopLink }

  // or leverage the helpers
  openOverview() {
    DevSummitNav.clickLink('overview');
  }
  // add a helper to get a session title
  getSessionTitle(entryNumber) {
    this.globalFooter.scrollIntoView();
    const targetEl = $(`.event-detail:nth-child(${entryNumber}) h3`);
    targetEl.waitForClickable({timeout:2000});
    return targetEl.getText();
  } 

}
// export an instance
export default new WorkshopsPage();