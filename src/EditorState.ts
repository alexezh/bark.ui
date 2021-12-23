import { CodeFileDef, project, SpriteDef } from "./Project";

export class BarkEditorState {
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

let editorState = new BarkEditorState();
export { editorState };