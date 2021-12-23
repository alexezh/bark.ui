import * as React from 'react';
import _ from "lodash";

import { editorState } from './EditorState';
import TextEditorToolbar from './TextEditorToolbar';
import { CodeFileDef, project } from './Project';

export interface ITextEditorCanvasProps {
  onClose: any
  codeFile?: CodeFileDef
}

export interface ITextEditorCanvasState {
  codeFile: CodeFileDef | undefined
  codeFileBlock?: string
  code: string
}

export default class TextEditorCanvas extends React.Component<ITextEditorCanvasProps, ITextEditorCanvasState> {
  constructor(props: ITextEditorCanvasProps) {
    super(props);

    _.bindAll(this, [
      'onCodeChange',
      'onToolbarChange'
    ]);

    let codeFile = props.codeFile === undefined ? project.def.codeFile : props.codeFile;
    let blockId = CodeFileDef.getLastEditedBlockId(codeFile);

    this.state = {
      codeFile: codeFile,
      codeFileBlock: blockId,
      code: CodeFileDef.getCode(codeFile, blockId)
    }
  }

  public render() {
    return (
      <div className="TextEditor-canvas">
        <TextEditorToolbar
          codeFile={editorState.lastEditedCodeFile}
          onClose={this.props.onClose}
          onChange={this.onToolbarChange} />
        <textarea
          className="TextEditor-text"
          value={this.state.code}
          onChange={this.onCodeChange}
        />
      </div>
    );
  }

  private onCodeChange(event: any) {
    this.setState({ code: event.target.value });
    if (this.state.codeFile !== undefined) {
      CodeFileDef.updateCode(this.state.codeFile, this.state.codeFileBlock, event.target.value);
    }
  }

  private onToolbarChange(file: CodeFileDef, block?: string) {
    console.log(block);
    this.setState({
      codeFile: file,
      codeFileBlock: block,
      code: CodeFileDef.getCode(file, block)
    });
  }
}
