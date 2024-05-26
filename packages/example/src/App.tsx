import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { CortexProvider } from "@azot-dev/react-cortex/dist";
import { Core } from "./cortex/_core";
import { useService } from "./cortex/utils/hooks";

const core = new Core();
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={core.getService("counter").decrement}>-</button>
        <button onClick={core.getService("counter").increment}>+</button>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
}

const AppWrapper = () => {
  return (
    <CortexProvider coreInstance={new Core()}>
      <App />
    </CortexProvider>
  );
};

export default AppWrapper;
