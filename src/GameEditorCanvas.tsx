import * as React from 'react';
import _ from "lodash";

import GameSpritePane from './GameSpritePane';
import GameEditorToolbar from './GameEditorToolbar';
import GameIFrame, { GameRuntimeClient } from './GameIFrame';
import * as bark from 'bark-core';
import workspace from './Workspace';

export enum EditorMode {
  GameEditor,
  CodeEditor,
  PaintEditor,
}

export interface IGameCanvasProps {
  editorMode: EditorMode;
  onChange: (mode: EditorMode) => void;
}

export interface IGameCanvasState {
  editorMode: EditorMode;
  runtimeClient: GameRuntimeClient;
}

export default class GameEditorCanvas extends React.Component<IGameCanvasProps, IGameCanvasState> {
  constructor(props: IGameCanvasProps) {
    super(props);

    _.bindAll(this, [
      'onEditCode',
      'onEditImages',
      'onEditLevel',
      'onDownloadProject',
      'onStartGame',
      'onStopGame',
      'onSpriteChange'
    ]);

    this.state = {
      editorMode: props.editorMode,
      runtimeClient: new GameRuntimeClient()
    }
  }

  private onSpriteChange(sprite: bark.SpriteDef) {
    console.log('Select sprite:' + sprite.id);
    this.state.runtimeClient.selectSprite(sprite.id);
  }

  private changeMode(editorMode: EditorMode) {
    this.props.onChange(editorMode);
    this.setState({ editorMode: editorMode });
  }

  private onEditCode() {
    this.changeMode(EditorMode.CodeEditor);
  }

  private onEditImages() {
    this.changeMode(EditorMode.PaintEditor);
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

    let projectJson = workspace.project.storage.toJson();
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

  public render() {
    let origin = document.location.origin;
    origin += "/bark.html";

    return (
      <div className={'Game-canvas'}>
        <GameEditorToolbar
          onEditCode={this.onEditCode}
          onEditImages={this.onEditImages}
          onEditLevel={this.onEditLevel}
          onDownloadProject={this.onDownloadProject}
          onStartGame={this.onStartGame}
          onStopGame={this.onStopGame} />

        <div className="Game-workarea">
          <GameIFrame runtimeClient={this.state.runtimeClient} />
          <GameSpritePane onChange={this.onSpriteChange} />
        </div>
      </div >
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