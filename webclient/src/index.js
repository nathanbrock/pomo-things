import React from 'react';
import ReactDOM from 'react-dom';

import ThingsPomo from './components/App';
import * as thingsService from './ThingsService';
import reportWebVitals from './reportWebVitals';

import './index.css';
import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render(
  <React.StrictMode>
    <ThingsPomo thingsService={thingsService} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
