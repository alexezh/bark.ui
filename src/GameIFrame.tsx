import * as React from 'react';
import _ from "lodash";

import * as project from './Project';
import workspace from './Workspace';
import { StorageOp, StorageOpKind } from './ProjectStorage';


export class GameRuntimeClient {
  private _frame: any | null = null;

  public constructor() {
    console.log('GameRuntimeClient: new');
    _.bindAll(this, [
      'onStorageUpdate'
    ]);
  }

  public setFrame(frame: any) {
    this._frame = frame;
  }

  public onStorageUpdate(ops: StorageOp[]) {
    if (this._frame !== null) {
      console.log('onStorageUpdate:' + ops[0].id + ' ' + ops[0].kind);
      let opsJson = JSON.stringify(ops);
      this._frame.contentWindow.postMessage(opsJson, '*');
    }
  }
}

export interface IGameIFrameProps {
  runtimeClient: GameRuntimeClient;
}

export interface IGameIFrameState {
  key: number;
  runtimeClient: GameRuntimeClient;
}

export default class GameIFrame extends React.Component<IGameIFrameProps, IGameIFrameState> {
  private container: any;

  constructor(props: IGameIFrameProps) {
    super(props);

    _.bindAll(this, [
    ]);

    this.state = {
      key: 0,
      runtimeClient: props.runtimeClient
    }
  }

  public componentDidMount() {
    window.addEventListener("message", (event) => {
      if (typeof event.data === 'string' || event.data instanceof String) {
        this.processEvent(event.data as string);
      }
    }, false);
  }

  private processEvent(opJson: string) {
    try {
      let op = JSON.parse(opJson);
      if (op.op === StorageOpKind.screenReady) {
        console.log('Initialize screen frame');
        this.state.runtimeClient.setFrame(this.container);
        project.project.storage.registerOnChange(this.state.runtimeClient.onStorageUpdate);
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  public render() {
    return (
      <iframe
        className="Game-iframe"
        key={this.state.key}
        src={document.location.href + '?gamescreen'}
        ref={e => { this.container = e; }} />
    );
  }
}

/*


        codeFile={editorState.lastEditedCodeFile}
        onClose={this.props.onClose}
        onChange={this.onToolbarChange} />
        <textarea
          className="Game-text"
          value={this.state.code}
          onChange={this.onCodeChange}

            var gameFrame = document.createElement('iframe');
gameFrame.id = 'gameFrame';
gameFrame.src = document.location;
gameFrame.class = ".gameIframe";
gameFrame.width = "100%";
gameFrame.height = "100%";
gameFrame.onload = function () {

    function onRun() {
        onStop();

        const gameFrameContainer = document.getElementById('gameFrameContainer');
        const codeArea = document.getElementById('codeArea');
        let text = codeArea.value;

        var gameFrame = document.createElement('iframe');
        gameFrame.id = 'gameFrame';
        gameFrame.src = document.location;
        gameFrame.class = ".gameIframe";
        gameFrame.width = "100%";
        gameFrame.height = "100%";
        gameFrame.onload = function () {
            loadGame(gameFrame, text);
        };
        // <iframe id="gameFrame" width="100%" height="100%" src="./">
        // </iframe>

        gameFrameContainer.appendChild(gameFrame);
        gameFrame.focus();
    }
    function onStop() {
        const gameFrame = document.getElementById('gameFrame');
        if (gameFrame !== null) {
            const gameFrameContainer = document.getElementById('gameFrameContainer');
            gameFrameContainer.removeChild(gameFrame);
        }
    }

*/