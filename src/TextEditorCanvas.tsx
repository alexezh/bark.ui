import * as React from 'react';
import _ from "lodash";

import { editorState } from './EditorState';
import TextEditorToolbar from './TextEditorToolbar';

export interface ITextEditorCanvasProps {
  onClose: any
}

export interface ITextEditorCanvasState {
  code: string
}

export default class TextEditorCanvas extends React.Component<ITextEditorCanvasProps, ITextEditorCanvasState> {
  constructor(props: ITextEditorCanvasProps) {
    super(props);

    _.bindAll(this, [
      'onCodeChange',
    ]);

    this.state = {
      code: ''
    }
  }

  public render() {
    return (
      <div className="TextEditor-canvas">
        <TextEditorToolbar codeFile={editorState.lastEditedCodeFile} onClose={this.props.onClose} />
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
}
