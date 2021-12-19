import * as React from 'react';
import _ from "lodash";

import { editorState } from './EditorState';
import TextEditorToolbar from './TextEditorToolbar';
import { CodeFileDef } from './Project';

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

    let blockId = props.codeFile?.getLastEditedBlockId();

    this.state = {
      codeFile: props.codeFile,
      codeFileBlock: blockId,
      code: CodeFileDef.getCode(props.codeFile, blockId)
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
