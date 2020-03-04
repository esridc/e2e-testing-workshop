# End-to-End Testing Workshop

This repo is the course content for the End-to-End Testing for Javascript applications, given at the 2020 Esri Developers Summit.

## Overview

The workshop introduces the concept of end-to-end testing, discusses how it fits within an overall testing strategy, and then uses a series of exercies to walk the participants through various examples, adding abstractions along the way.



## Exercises

### [Hello World](./1-wdio-starter/README.md)

In this exercise we will get Webdriver setup and running.

### [WebDriver 101](./2-google-test/README.md)

Using the structure of the first exercise, we build out knowledge by executing a google search, and following a link.

### [Digging into a Page](./3-agenda-page/README.md)

Continuing on, we explore deep selectors, more navigation and validation

### [Adding Abstractions](./4-page-objects/README.md)

At this point we've got one spec file that has a lot of selectors, page orchestration and assertions all in a jumble of code. If we needed to expand this to cover more of the DevSummit site, we'd be in for a world of hurt. Thus, it's time to introduce some abstractions, via the [Page Object Pattern](https://webdriver.io/docs/pageobjects.html)