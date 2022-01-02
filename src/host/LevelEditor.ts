import { screen, level } from './GameLoader';
import * as project from 'bark-core';

export class LevelEditor {
  private _sprite: project.SpriteDef | undefined;

  public selectSprite(id: string) {
    this._sprite = project.project.findSpriteById(id);
  }

  public setTile() {

  }
}

export let levelEditor = new LevelEditor();