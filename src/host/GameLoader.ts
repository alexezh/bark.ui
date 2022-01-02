
import * as React from 'react';
import _ from "lodash";
import * as bark from 'bark-core';

// globals used by rest of code
//export var game = new bark.Game();
export let storage = new bark.ProjectLocalStorage();

export let levelProps = {
  gridWidth: 48,
  gridHeight: 8,
  tileWidth: 32,
  tileHeight: 32
};

export let screenDef = new bark.ScreenDef(
  storage,
  {
    screenWidth: levelProps.tileWidth * 20,
    screenHeight: levelProps.tileHeight * 8
  });

export let screen = new bark.Screen(screenDef);

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
        //        levelEditor.selectSprite(op.id);
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
