# Page Objects

Keeping our test suites well organized is important, and utilizing the [Page Object Pattern](https://webdriver.io/docs/pageobjects.html) is a great way to help with this.

> The goal of using page objects is to abstract any page-specific information away from the actual tests. Ideally, you should store all selectors or specific instructions that are unique for a certain page in a page object, so that you still can run your test after you've completely redesigned your page.

### Google Search Page
We'll start by moving the Google selectors etc into a class


```

```


### Base Page Object

Since we know we have a second page to deal with, let's hoist up some common helpers into a base class, then have the Google Search Page and the Agenda Page extend from that

```
```