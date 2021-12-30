//-- <reference path="../node_modules/bark-core/src/screen.ts" />
//-- <reference path="../node_modules/bark-core/src/game.ts" />

import * as React from 'react';
import _ from "lodash";

import * as project from './Project';
import workspace from './Workspace';
import GameSpritePane from './GameSpritePane';
import GameEditorToolbar from './GameEditorToolbar';
import { StorageOp, StorageOpKind } from './ProjectStorage';
import { stringify } from 'querystring';

// globals used by rest of code
//export var game = new bark.Game();
let bark: any = window['bark'];
export let screen = new bark.Screen();
export let level = null;
//export var input = new bark.Input();

class GameLoader {
  private objects: { [id: string]: any } = {};

  private loadCodeBlock(name: string, code: string) {

  }

  private setProject(project: any) {
    console.log("Screen: width:" + project.props.screenWidth + " height:" + project.props.screenHeight);

    // @ts-ignore
    screen.resize(project.props.screenWidth, project.props.screenHeight);
  }

  private setLevel(levelOp: any) {
    console.log("Level: width:" + levelOp.props.gridWidth + " height:" + levelOp.props.gridHeight);

    if (level === null) {
      level = new bark.TileLevel(levelOp.props);
      screen.setLevel(level);
    } else {
      // @ts-ignore
      level.resize(levelOp.props.gridWidth, levelOp.props.gridHeight);
    }
  }

  public processSet(value: any) {
    switch (value.target) {
      case 'Project':
        this.setProject(value);
        break;
      case 'TileLevel':
        this.setLevel(value);
        break;
      case 'Sprite':
        break;
      case 'CodeFile':
        break;
      case 'CodeBlock':
        this.loadCodeBlock(value.name, value.code);
        break;
      case 'Costume':
        break;
    }
  }

  public processOp(op: any) {
    switch (op.kind) {
      case 'set':
        this.processSet(op.value);
        break;
      case 'remove':
        delete project[op.id];
        break;
      case 'edit':
        screen.setEditMode(true);
        break;
      case 'run':
        screen.setEditMode(false);
        break;
      case 'selectSprite':
        screen.selectSprite(op.id);
        break;
    }
  }

  public processEvent(opsJson: string) {
    try {
      let ops = JSON.parse(opsJson);
      ops.forEach((x: any) => this.processOp(x));
    }
    catch (error) {
      console.log('cannot parse ops')
      throw (error);
    }
  }
}

let loader = new GameLoader();

export interface IGameScreenProps {
}

export interface IGameScreenState {
}

export default class GameScreen extends React.Component<IGameScreenProps, IGameScreenState> {
  private canvasRef: any;

  constructor(props: IGameScreenProps) {
    super(props);

    _.bindAll(this, [
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

  public render() {
    return (
      <div className='Game-screen'>
        <canvas ref={e => { this.canvasRef = e }} />
      </div>
    );
  }
}

