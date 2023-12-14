---
sidebar_position: 1
---

# Motivation

The full documentation can be found [here](https://azot-dev.github.io/cortex/docs/get-started)



## Why this library ?

As a React Native developer, I struggled for a long time finding the right architecture, I had to deal with a lot of logic in my apps (bluetooth, offline mode)

Trying to optimize my code, I used RTK Query, React Query, but I figured out that the API is not the only external dependency of an app and the cache can't be trusted as a store in many projects I worked on.

So I tried clean architecture with Redux Toolkit, very nice but still hard to read for developers who don't master clean architecture principles and Redux.

I ended up with the Cortex architecture, in order to help developers (and myself) to gain more readability over their code, help them test it easily, and not to be stopped by any architectural issue the could encounter.

Cortex is easy to use, and can be setup at the architecture complexity you want.

## Purpose

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
