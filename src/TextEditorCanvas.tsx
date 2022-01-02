import * as React from 'react';
import _ from "lodash";

import workspace from './Workspace';
import TextEditorToolbar from './TextEditorToolbar';
import { CodeBlockDef, CodeFileDef } from 'bark-core';

export interface ITextEditorCanvasProps {
  onClose: any;
  codeBlock?: CodeBlockDef;
}

export interface ITextEditorCanvasState {
  codeBlock: CodeBlockDef | undefined
  codeId: string | undefined;
}

export default class TextEditorCanvas extends React.Component<ITextEditorCanvasProps, ITextEditorCanvasState> {
  constructor(props: ITextEditorCanvasProps) {
    super(props);

    _.bindAll(this, [
      'onCodeChange',
      'onToolbarChange'
    ]);

    let codeBlock = props.codeBlock === undefined ? workspace.project.screen.codeFile.firstBlock : props.codeBlock;

    this.state = {
      codeBlock: codeBlock,
      codeId: codeBlock?.codeId
    }
  }

  private onCodeChange(event: any) {
    if (this.state.codeBlock !== undefined) {
      this.state.codeBlock.updateCode(event.target.value);
    }
    // update id to trigger reload
    this.setState({ codeId: this.state.codeBlock?.codeId });
  }

  private onToolbarChange(codeBlock: CodeBlockDef | undefined) {
    console.log(codeBlock);
    this.setState({
      codeBlock: codeBlock,
      codeId: codeBlock?.codeId
    });
  }

  public render() {
    return (
      <div className="TextEditor-canvas">
        <TextEditorToolbar
          codeBlock={workspace.lastEditedCodeBlock}
          onClose={this.props.onClose}
          onChange={this.onToolbarChange} />
        <textarea
          className="TextEditor-text"
          value={this.state.codeBlock?.code}
          onChange={this.onCodeChange}
        />
      </div>
    );
  }
}
