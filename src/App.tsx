import React from 'react';
import logo from './logo.svg';
import AppCanvas from './AppCanvas'
import GameScreen from './GameScreen'
import Paper from 'paper';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

export function App() {
  return (
    { window.self === window.top ? <AppCanvas /> : <GameScreen /> }
  );
}

export default App;