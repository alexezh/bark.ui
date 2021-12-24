import { CodeFileDef, project, SpriteDef } from "./Project";

/**
 * keeps track of project wide properties
 */
export class Workspace {
  private _lastEditedCodeFile?: CodeFileDef;
  private _lastEditedSprite?: SpriteDef;
  public get lastEditedCodeFile(): CodeFileDef {
    if (this._lastEditedCodeFile !== undefined) {
      return this._lastEditedCodeFile;
    }

    return project.def.codeFile;
  }

  public get lastEditedSprite(): SpriteDef {
    if (this._lastEditedSprite !== undefined) {
      return this._lastEditedSprite;
    }

    return project.def.sprites[0];
  }
}

let workspace = new Workspace();
export default workspace;