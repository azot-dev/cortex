import React, { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';

function App() {
  const [state, setState] = useState([]);

  useEffect(() => {
    console.log('envoi du message get current state');
    chrome.runtime.sendMessage(
      { type: 'GET_CURRENT_STATE' },
      function (response) {
        if (response?.data) {
          setState(response.data);
        }
      }
    );

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.type === 'UPDATE_UI') {
        setState(request.data);
      }
    });
  }, []);

  return (
    <div className="App">
      <React.Fragment>
        <ReactJson src={state} />
      </React.Fragment>
    </div>
  );
}

export default App;
