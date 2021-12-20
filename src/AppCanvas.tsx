import * as React from 'react';
import ReactModal from 'react-modal';
import _ from "lodash";

import MainToolbar from './MainToolbar';
import TextEditorCanvas from './TextEditorCanvas';
import GameCanvas from './GameCanvas';

import './App.css';
import { CodeFileDef, project } from './Project';
import { throws } from 'assert';

export interface IAppCanvasProps {
}

export interface IAppCanvasState {
  showModal: boolean;
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
      showModal: false
    }
  }

  public render() {

    return (
      <div className="Canvas-main">
        <MainToolbar onEditCode={this.onEditCode} onEditImages={this.onEditImages} onEditLevel={this.onEditLevel} />
        <GameCanvas />

        <ReactModal
          isOpen={this.state.showModal}
          contentLabel="Minimal Modal Example"
        >
          <TextEditorCanvas onClose={this.onCloseModal} codeFile={this.state.codeFile} />
        </ReactModal>
      </div>
    );
  }

  //           <button onClick={this.onCloseModal}>Close Modal</button>

  private openModal() {
    this.setState({ showModal: true });
  }

  private onCloseModal() {
    this.setState({ showModal: false });
  }

  private onEditCode() {
    this.openModal();
  }

  private onEditImages() {


  }
  private onEditLevel() {

  }
}
