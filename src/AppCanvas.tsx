import * as React from 'react';
import ReactModal from 'react-modal';
import _ from "lodash";

import MainToolbar from './MainToolbar';
import TextEditorCanvas from './TextEditorCanvas';
import GameCanvas from './GameCanvas';
import PaintCanvas from './PaintCanvas';

import './App.css';
import { CodeFileDef, project } from './Project';
import { throws } from 'assert';

export interface IAppCanvasProps {
}

enum EditorKind {
  Unknown,
  CodeEditor,
  PaintEditor,
}

export interface IAppCanvasState {
  showModal: boolean;
  editorKind: EditorKind;
  codeFile?: CodeFileDef;
}

export default class AppCanvas extends React.Component<IAppCanvasProps, IAppCanvasState> {
  constructor(props: IAppCanvasProps) {
    super(props);

    _.bindAll(this, [
      'onEditCode',
      'onEditImages',
      'onEditLevel',
      'onCloseModal'
    ]);

    // this.onEditCode = this.onEditCode.bind(this);

    this.state = {
      showModal: false,
      editorKind: EditorKind.Unknown
    }
  }

  public render() {

    return (
      <div className="Canvas-main">
        <MainToolbar onEditCode={this.onEditCode} onEditImages={this.onEditImages} onEditLevel={this.onEditLevel} />
        <GameCanvas />

        <ReactModal isOpen={this.state.showModal} contentLabel="CodeEditor">
          {
            this.state.editorKind === EditorKind.CodeEditor ?
              <TextEditorCanvas onClose={this.onCloseModal} codeFile={this.state.codeFile} /> : null
          }
          {
            this.state.editorKind === EditorKind.PaintEditor ?
              <PaintCanvas onClose={this.onCloseModal} codeFile={this.state.codeFile} /> : null
          }
        </ReactModal>
      </div>
    );
  }

  //           <button onClick={this.onCloseModal}>Close Modal</button>

  private onCloseModal() {
    this.setState({ showModal: false });
  }

  private onEditCode() {
    this.setState({ showModal: true, editorKind: EditorKind.CodeEditor });
  }

  private onEditImages() {
    this.setState({ showModal: true, editorKind: EditorKind.PaintEditor });
  }
  private onEditLevel() {

  }
}
