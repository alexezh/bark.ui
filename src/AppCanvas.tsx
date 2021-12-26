import * as React from 'react';
import ReactModal from 'react-modal';
import _ from "lodash";

import MainToolbar from './MainToolbar';
import TextEditorCanvas from './TextEditorCanvas';
import GameCanvas from './GameCanvas';
import PaintEditorCanvas from './paint/PaintEditorCanvas';
import workspace from './Workspace';
import * as project from './Project';

import './App.css';
import { Modal } from 'react-bootstrap';

export interface IAppCanvasProps {
}

enum EditorMode {
  GameEditor,
  CodeEditor,
  PaintEditor,
}

export interface IAppCanvasState {
  showModal: boolean;
  editorMode: EditorMode;
  codeFile?: project.CodeFileDef;
  windowWidth: number;
}

export default class AppCanvas extends React.Component<IAppCanvasProps, IAppCanvasState> {
  constructor(props: IAppCanvasProps) {
    super(props);

    _.bindAll(this, [
      'onEditCode',
      'onEditImages',
      'onEditLevel',
      'onDownloadProject',
      'handleResize',
      'onStartGame',
      'onStopGame',
      'onCloseModal'
    ]);

    // this.onEditCode = this.onEditCode.bind(this);

    this.state = {
      showModal: false,
      editorMode: EditorMode.GameEditor,
      windowWidth: window.innerWidth
    }
  }

  handleResize(e) {
    this.setState({ windowWidth: window.innerWidth });
  };

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.addEventListener("resize", this.handleResize);
  }

  //           <button onClick={this.onCloseModal}>Close Modal</button>

  private onCloseModal() {
    this.setState({ showModal: false });
  }

  private onEditCode() {
    this.setState({ showModal: true, editorMode: EditorMode.CodeEditor });
  }

  private onEditImages() {
    this.setState({ showModal: true, editorMode: EditorMode.PaintEditor });
  }

  private onEditLevel() {

  }

  private onStartGame() {
    console.log('onStartGame');
  }

  private onStopGame() {
    console.log('onStopGame');
  }


  private onDownloadProject() {

    let projectJson = project.project.toJson();
    var codeBlob = new Blob([projectJson], { type: 'text/plain' });

    var downloadLink = document.createElement("a");
    downloadLink.download = 'test.json';
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
      // Chrome allows the link to be clicked without actually adding it to the DOM.
      downloadLink.href = window.webkitURL.createObjectURL(codeBlob);
    } else {
      // Firefox requires the link to be added to the DOM before it can be clicked.
      downloadLink.href = window.URL.createObjectURL(codeBlob);
      downloadLink.onclick = this.destroyClickedElement;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
    }

    downloadLink.click();
  }

  private destroyClickedElement(event) {
    // remove the link from the DOM
    document.body.removeChild(event.target);
  }

  //  <ReactModal isOpen={this.state.showModal} contentLabel="CodeEditor">
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

        {
          this.state.editorMode === EditorMode.GameEditor ?
            <GameCanvas /> : null
        }

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
