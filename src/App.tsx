import React from 'react';
import logo from './logo.svg';
import AppCanvas from './AppCanvas'
import GameScreen from './game/GameScreen'
import Paper from 'paper';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

export function App() {
  if (window.self === window.top) {
    return (<AppCanvas />);
  } else {
    return (<GameScreen />);
  }
}

export default App;