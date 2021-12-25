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
      'onCloseModal'
    ]);

    // this.onEditCode = this.onEditCode.bind(this);

    this.state = {
      showModal: false,
      editorKind: EditorKind.Unknown,
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

  public render() {
    return (
      <div id='AppCanvas' className="Canvas-main">
        <MainToolbar
          onEditCode={this.onEditCode}
          onEditImages={this.onEditImages}
          onEditLevel={this.onEditLevel}
          onDownloadProject={this.onDownloadProject} />
        <GameCanvas />

        <ReactModal isOpen={this.state.showModal} contentLabel="CodeEditor">
          {
            this.state.editorKind === EditorKind.CodeEditor ?
              <TextEditorCanvas onClose={this.onCloseModal} codeBlock={workspace.lastEditedCodeBlock} /> : null
          }
          {
            this.state.editorKind === EditorKind.PaintEditor ?
              <PaintEditorCanvas onClose={this.onCloseModal} /> : null
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
}
