//-- <reference path="../node_modules/bark-core/src/screen.ts" />
//-- <reference path="../node_modules/bark-core/src/game.ts" />

import * as React from 'react';
import _ from "lodash";

import * as project from '../Project';
import workspace from '../Workspace';
import { StorageOp, StorageOpKind } from '../ProjectStorage';
import { levelEditor } from './LevelEditor';

// globals used by rest of code
//export var game = new bark.Game();
export let bark: any = window['bark'];
export let screen = new bark.Screen();
export let level = null;

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
        levelEditor.selectSprite(op.id);
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
