import { CodeBlockDef, CodeFileDef, project, SpriteDef } from "bark-core";

/**
 * keeps track of project wide properties
 */
export class Workspace {
  private _lastEditedCodeBlock?: CodeBlockDef;
  private _lastEditedSprite?: SpriteDef;
  public get lastEditedCodeBlock(): CodeBlockDef {
    if (this._lastEditedCodeBlock !== undefined) {
      return this._lastEditedCodeBlock;
    }

    // @ts-ignore project will have one code block
    return project.def.codeFile.firstBlock;
  }

  /**
   * returns last sprite which was edited or first sprite
   */
  public get lastEditedSprite(): SpriteDef {
    if (this._lastEditedSprite !== undefined) {
      return this._lastEditedSprite;
    }

    return project.def.sprites[0];
  }

  public set lastEditedSprite(sprite: SpriteDef) {
    this._lastEditedSprite = sprite;
  }
}

let workspace = new Workspace();
export default workspace;