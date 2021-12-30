//-- <reference path="../node_modules/bark-core/src/screen.ts" />
//-- <reference path="../node_modules/bark-core/src/game.ts" />

import * as React from 'react';
import _ from "lodash";

import { level, screen } from './GameLoader';
import { StorageOp, StorageOpKind } from 'bark-core';
import * as project from 'bark-core';
import workspace from '../Workspace';
import { levelEditor } from './LevelEditor';

export interface IGameScreenProps {
}

export interface IGameScreenState {
}

export default class GameScreen extends React.Component<IGameScreenProps, IGameScreenState> {
  private canvasRef: any;

  constructor(props: IGameScreenProps) {
    super(props);

    _.bindAll(this, [
      'onMouseDown',
      'onMouseUp'
    ]);

    this.state = {
    }
  }

  public componentDidMount() {
    window.addEventListener("message", (event) => {
      if (typeof event.data === 'string' || event.data instanceof String) {
        loader.processEvent(event.data as string);
      }
    }, false);

    screen.setCanvas(this.canvasRef);

    let readyOp = {
      op: StorageOpKind.screenReady
    }
    window.parent.postMessage(JSON.stringify(readyOp), '*');
  }

  private onMouseDown(event: any): void {
    levelEditor.setTile();
  }

  private onMouseUp(event: any) {

  }

  public render() {
    return (
      <div className='Game-screen'>
        <canvas
          ref={e => { this.canvasRef = e }}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp} />
      </div>
    );
  }
}

