---
sidebar_position: 3
---

# Test an API

The previous examples show how to test an app, but they were far from a production app.
How can we mock an API data or any other external service (bluetooth, date, blockchain...)

Let's have a brief introduction to clean architecture with a simple example every web developer deals with: consume a distant API.

:::tip What You'll Learn

- Fake API data to build a front with no backend
- Mock API data to test the behavior

:::

:::info Prerequisites

- Understanding of [port-adapter pattern](https://kulshekhar.github.io/ts-jest/docs/getting-started/installation/)

:::

<iframe 
    src="https://t7w33f-5173.csb.app/"
    style={{ width: "100%", height: "500px", border: "0", borderRadius: "4px", overflow: "hidden" }}
    title="frosty-surf-4kp6v2"
    allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

[![Edit frosty-surf-4kp6v2](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/devbox/github/azot-dev/cortex/tree/main/examples/counter?embed=1&file=%2Fsrc%2Fcortex%2Fservices%2Fcounter.service.ts)

## Create a gateway

A gateway is an interface in typescript, it describes the type of parameters and return values of the different methods
It is a contract that any adapter should fit to

## Adapters

The 3 main types of adapters are:

- Real

It returns the real data, so it is used in production code

- Fake

It returns hardcoded data, so it is useful to show some basic behaviors to the users without having to create a real backend

- Stub

It returns data that is injected, very useful for tests