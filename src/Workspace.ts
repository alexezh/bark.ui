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

    return this._project.screen.sprites.getByIndex(0);
  }

  public set lastEditedSprite(sprite: bark.SpriteDef) {
    this._lastEditedSprite = sprite;
  }

  public constructor() {
    this._project = bark.Project.createEmptyProject();
  }
}

let workspace = new Workspace();
export default workspace;