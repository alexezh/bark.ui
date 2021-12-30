/// <reference path="../node_modules/bark-core/src/screen.ts" />
/// <reference path="../node_modules/bark-core/src/game.ts" />

import * as React from 'react';
import _ from "lodash";

import * as project from './Project';
import workspace from './Workspace';
import GameSpritePane from './GameSpritePane';
import GameEditorToolbar from './GameEditorToolbar';
import { StorageOp } from './ProjectStorage';
import { stringify } from 'querystring';

// globals used by rest of code
export var game = new bark.Game();
export var screen = new bark.Screen();
//export var input = new bark.Input();

class GameLoader {
  private objects: { [id: string]: any } = {};

  private loadCodeBlock(name: string, code: string) {

  }

  private loadProject(project: any) {
    console.log("width:" + project.props.gridWidth + " height:" + project.props.gridHeight);

    screen.resize(project.props.gridWidth, project.props.gridHeight);
  }

  public processOp(op: any) {
    if (op.kind === 'update') {
      project[op.id] = op.value;
      console.log('process ' + op.value.target);
      if (op.value.target === 'Project') {
        this.loadProject(op.value);
      }
      else if (op.value.target === 'CodeBlock') {
        this.loadCodeBlock(op.value.name, op.code);
      }
    } else if (op.op == 'edit') {
      screen.setEditMode(true);
    } else if (op.op == 'run') {
      screen.setEditMode(false);
    } else if (op.op == 'remove') {
      delete project[op.id];
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
  private container: any;

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
  }

  public render() {
    return (
      <div />
    );
  }
}

