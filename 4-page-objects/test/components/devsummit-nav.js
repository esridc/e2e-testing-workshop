class DevSummitNav {

  // Selectors for the entries in the nav
  get navOverviewLink () { return $('li.es-nav-subitem:nth-child(1) > a'); }

  get navAgendaDropDown () { return $('li.es-nav-subitem:nth-child(2) > a'); }
  get navAgendaAgendaLink () { return $('li.es-nav-subitem:nth-child(2) > div > ul > li:nth-child(1) > a'); }
  get navAgendaKeynoteLink () { return $('li.es-nav-subitem:nth-child(2) > div > ul > li:nth-child(2) > a'); }
  get navAgendaWorkshopLink () { return $('li.es-nav-subitem:nth-child(2) > div > ul > li:nth-child(3) > a'); }

  openDropdown (name) {
    switch (name) {
      case 'overview': 
        this.navOverviewLink.click();
        break;
      case 'agenda':
        this.navAgendaDropDown.click();
        break;
    }
  }

  clickLink (name) {
    switch (name) {
      case 'overview': 
        this.navOverviewLink.click();
        break;
      case 'agenda:agenda':
        this.navAgendaAgendaLink.click();
        break;
      case 'agenda:keynote':
        this.navAgendaKeynoteLink.click();
        break;
      case 'agenda:workshops':
        this.navAgendaWorkshopLink.click();
        break;
    }
  }

}
// export an instance
export default new DevSummitNav();