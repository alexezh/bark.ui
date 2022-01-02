import * as bark from "bark-core";

/**
 * keeps track of project wide properties
 */
export class Workspace {
  private _project: bark.Project;
  private _lastEditedCodeBlock?: bark.CodeBlockDef;
  private _lastEditedSprite?: bark.SpriteDef;

  public get project(): bark.Project { return this._project; }

  public get lastEditedCodeBlock(): bark.CodeBlockDef {
    if (this._lastEditedCodeBlock !== undefined) {
      return this._lastEditedCodeBlock;
    }

    // @ts-ignore project will have one code block
    return project.def.codeFile.firstBlock;
  }

  /**
   * returns last sprite which was edited or first sprite
   */
  public get lastEditedSprite(): bark.SpriteDef {
    if (this._lastEditedSprite !== undefined) {
      return this._lastEditedSprite;
    }

    return this._project.screen.sprites[0];
  }

  public set lastEditedSprite(sprite: bark.SpriteDef) {
    this._lastEditedSprite = sprite;
  }

  public constructor() {
    let storage = new bark.ProjectLocalStorage();

    let levelProps = {
      gridWidth: 48,
      gridHeight: 8,
      tileWidth: 32,
      tileHeight: 32
    };

    let screen = new bark.ScreenDef(
      storage,
      {
        screenWidth: levelProps.tileWidth * 20,
        screenHeight: levelProps.tileHeight * 8
      });

    screen.createLevel(levelProps);

    this._project = new bark.Project(storage, screen);
  }
}

let workspace = new Workspace();
export default workspace;