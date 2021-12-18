import * as React from 'react';
import MainToolbar from './maintoolbar';
import ReactModal from 'react-modal';
import _ from "lodash";

import './App.css';

export interface IBarkCanvasProps {
}

export interface IBarkCanvasState {
  showModal: boolean;
}

export default class BarkCanvas extends React.Component<IBarkCanvasProps, IBarkCanvasState> {
  constructor(props: IBarkCanvasProps) {
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

        <ReactModal
          isOpen={this.state.showModal}
          contentLabel="Minimal Modal Example"
        >
          <button onClick={this.onCloseModal}>Close Modal</button>
        </ReactModal>
      </div>
    );
  }

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
