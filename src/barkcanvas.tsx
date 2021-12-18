import * as React from 'react';
import MainToolbar from './maintoolbar';
import './App.css';

export interface IBarkCanvasProps {
}

export interface IBarkCanvasState {
}

export default class BarkCanvas extends React.Component<IBarkCanvasProps, IBarkCanvasState> {
  constructor(props: IBarkCanvasProps) {
    super(props);

    this.state = {
    }
  }

  public render() {
    return (
      <div className="Canvas-main">
        <MainToolbar />
      </div>
    );
  }
}
