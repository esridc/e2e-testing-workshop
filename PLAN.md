Time Blocking: 8:30am --> 5:00

8:15-> 8:30: Be in the room, setting up, help people ensure they have requirements on machines
8:30 - 8:45: Intro and Logistics
- who we are
- who they are
- restrooms
- break 10
- lunch 12

Zen of Testing 8:45 - 9:15 - **Dave**
- why test at all?
- manual vs robots
  - people are inconsistent and cost $$
  - people are good for intl testing!
- unit vs component vs acc
- what else can 🤖 's do for us?
   - Dave has some content in "Test-Tooling.pptx"
   - check translations / lint rules
   - warnings and deprecations
- testing at scale
   - sending test output to a logging system 
   - using dashboards to show trends / performance
      - faster tests === faster feedback loops
   - really useful for trends of failures (i.e what upstream systems are flaky) 
 
- framework test strategies
  - Angular / React / Vue / Ember
- agnostic e2e
  - drives a browser
  - compariatively slow... 
  - can be run against many browsers (crossbrowsertesting.com)
  - simulates real user interactions
  - flexes the whole stack
    - usually done w/ a separate QA stack
- test workflows
  - ad-hoc vs CI   
  
Stack Review - 9:15 - 9:30 - **Tate**
- node + editor of choice
- webdriver.io
  - selenium + browsers
  - provides API to drive the browser, inspect DOM, make assertions
- Getting Started (walk-thru)
  - create folder
  - npm init
  - install deps
  - index.js
  - open google.com

HANDS ON: Hello-World - 9:30 - 9:45 (15 min)
- have class do the same stuff we just demoed

**Tate:** WebDriver 101 9:45 - 10:15 (walk-thru w/ explanations)
- super simple single file example
- walk thru the code almost a line at a time
- imports
- open google
- search for `esri devsummit workshops`
- get first entry
- ensure a tag has -> "Pre-Summit Hands-On Training | 2020", 
- click link
- expect url to be `https://www.esri.com/en-us/about/events/devsummit/agenda/pre-summit-hands-on-training`


BREAK: 10:15 - 10:30

HANDS ON: 10:30 - 11:00 (30 min) 
- class does the WebDriver 101

**Tate:** Digging into a Page 11:00 - 11:30
- walk thru the 3rd exercise
- main things here is digging into the dom, choosing selectors


HANDS ON: Exercise 3 - 11:30 - 12:00

Lunch: 12 - 1

**Dave:** Adding Abstraction 1:00 - 1:30
- locate the course entry
- Look at the DOM - we see big set of `<div`'s uh-oh...
- to get our course we'll need to use a n-th selector
  - in apps you control, it's preferable to add data-test attrs enabling you to locate content
- `event-detail-registration_heading`
- current code is getting messy
- we've opened two pages (google and the event page)
- we have selectors + assertions all mixed up
- scaling this up is unsustainable 
- Enter Page model
  - present details on this...
- Add simple page models to the 101

HANDS ON: 1:30 - 2:00
- class does the Page Model exercise

**Tate** Workgin with Maps 2:00 - 2:30
- walk thru

BREAK: 2:30 - 3:00

HANDS ON: Exercise #5 3:00-3:30


Real-World E2E Projects 3:30 - 4:30 (Talk) Dave & Andew split
- run test automatically if possible (CI)
- on failure, give good messages
- organize code to make specs easy to write and easy to debug
  - Pages and Components and Flows   
- handling credentials with dot.env
- run test as multiple types of users
  - different types of users, orgs etc
- abstraction of the what vs the how
- where to put assertions
- validating non-visual changes
  - pattern - connect to data store and verify directy 
  - arcgis-rest-js integration 

DEMO: Hub E2e Tour + Run
- talk about hub a little
- size of app
- testing strategy
  - lots of unit, less component, less acc, less E2e
- run at crossbrowsertesting.com
- run a subset of tests just to watch it
- Target 30 min

Testing w/ AGO
- oAuth patterns
   - pop-out oauth vs full-page transition flow
       - why one vs other?

Chicken & Egg Problem
- how do you write e2e tests for code that's not yet deployed?
- have a staging environment
