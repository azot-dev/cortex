---
sidebar_position: 1
---

# Overview

<div style={{textAlign: "center", marginBottom: 30}}>
  <img alt="scheme" width="500px" height="500px"  src={require('@site/static/img/cortex-scheme.png').default} />
</div>

React is a library not a framework, it has been created to reflect the changes of some variables (the states) to the UI, nothing else.
Cortex comes as the missing brick of React, and will give all the keys to create the perfect architecture of your app, keeping your code readable and your app scalable.

With this you could:

- share your code between React and React Native (and any other JS framework)
- test your logic directly with Jest (no more react-testing-library to test your data over the UI)
- code in test driven development (TDD)
- create a clean architecture with the port/adapter pattern
- keep each part of your logic well separated thanks to services

All of that using oriented object programming!

## Technical choices

It is built over [the legend app state lib](https://legendapp.com/open-source/state/), and add a strongly typed system of services and dependency injections


