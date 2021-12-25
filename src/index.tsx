import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactModal.setAppElement('#root');

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

document.getElementById('root')?.setAttribute('className', 'App-root');

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
