import { CodeFileDef, project } from "./Project";

export class BarkEditorState {
  private _lastEditedCodeFile?: CodeFileDef;
  public get lastEditedCodeFile(): CodeFileDef {
    if (this._lastEditedCodeFile !== undefined) {
      return this._lastEditedCodeFile;
    }

    return project.def.codeFile;
  }
}

let editorState = new BarkEditorState();
export { editorState };