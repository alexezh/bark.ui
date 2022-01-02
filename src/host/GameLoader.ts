
import * as React from 'react';
import _ from "lodash";

import workspace from '../Workspace';
import * as project from 'bark-core';
import { levelEditor } from './LevelEditor';

// globals used by rest of code
//export var game = new bark.Game();
export let bark: any = window['bark'];
export let storage = new bark.ProjectLocalStorage();
export let screen = new bark.Screen();
export let level = null;

class GameLoader {
  public processOp(op: any) {
    switch (op.kind) {
      case 'set':
        break;
      case 'remove':
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

export let loader = new GameLoader();
