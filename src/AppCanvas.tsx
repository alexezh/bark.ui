import * as React from 'react';
import _ from "lodash";

import TextEditorCanvas from './TextEditorCanvas';
import GameCanvas, { EditorMode } from './GameCanvas';
import PaintEditorCanvas from './paint/PaintEditorCanvas';
import workspace from './Workspace';
import * as project from './Project';

import './App.css';

export interface IAppCanvasProps {
}

export interface IAppCanvasState {
  editorMode: EditorMode;
  codeFile?: project.CodeFileDef;
  windowWidth: number;
  windowHeight: number;
}

export default class AppCanvas extends React.Component<IAppCanvasProps, IAppCanvasState> {
  constructor(props: IAppCanvasProps) {
    super(props);

    _.bindAll(this, [
      'handleResize',
      'onModeChange',
      'onCloseModal'
    ]);

    // this.onEditCode = this.onEditCode.bind(this);

    this.state = {
      editorMode: EditorMode.GameEditor,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    }
  }

  handleResize(e) {
    this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
  };

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.addEventListener("resize", this.handleResize);
  }

  onModeChange(mode: EditorMode) {
    this.setState({ editorMode: mode });
  }

  onCloseModal() {
    this.setState({ editorMode: EditorMode.GameEditor });
  }

  //  <ReactModal isOpen={this.state.showModal} contentLabel="CodeEditor">
  public render() {
    return (
      <div id='AppCanvas' className="Canvas-main">
        <GameCanvas onChange={this.onModeChange} editorMode={this.state.editorMode} />

        {
          this.state.editorMode === EditorMode.CodeEditor ?
            <TextEditorCanvas onClose={this.onCloseModal} codeBlock={workspace.lastEditedCodeBlock} /> : null
        }
        {
          this.state.editorMode === EditorMode.PaintEditor ?
            <PaintEditorCanvas onClose={this.onCloseModal} /> : null
        }
      </div >
    );
  }
  /*
    public render() {
      return (
        <div id='AppCanvas' className="Canvas-main">
          <MainToolbar
            onEditCode={this.onEditCode}
            onEditImages={this.onEditImages}
            onEditLevel={this.onEditLevel}
            onDownloadProject={this.onDownloadProject}
            onStartGame={this.onStartGame}
            onStopGame={this.onStopGame} />
          <GameCanvas />
  
          {
            this.state.editorKind === EditorKind.CodeEditor ?
              <Modal show={true} fullscreen={true}>
                <Modal.Header closeButton>
                  <Modal.Title>Modal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <TextEditorCanvas onClose={this.onCloseModal} codeBlock={workspace.lastEditedCodeBlock} />
                </Modal.Body>
              </Modal> : null
          }
          {
            this.state.editorKind === EditorKind.PaintEditor ?
              <Modal.Dialog fullscreen={true}>
                <Modal.Body>
                  <PaintEditorCanvas onClose={this.onCloseModal} />
                </Modal.Body>
              </Modal.Dialog > : null
          }
        </div >
      );
    }
    */
}
