import * as React from 'react';
import _ from "lodash";

import workspace from './Workspace';
import GameSpritePane from './GameSpritePane';
import * as project from './Project';

export interface IGameCanvasProps {
}

export interface IGameCanvasState {
  iframeKey: number
}

export default class GameCanvas extends React.Component<IGameCanvasProps, IGameCanvasState> {
  constructor(props: IGameCanvasProps) {
    super(props);

    _.bindAll(this, [
    ]);

    this.state = {
      iframeKey: 1,
    }
  }

  private onSpriteChange(sprite: project.SpriteDef) {
    console.log('Select sprite:' + sprite.id);
  }

  public render() {
    let origin = document.location.origin;
    origin += "/bark.html";

    return (
      <div className="Game-canvas">
        <iframe key={this.state.iframeKey} src={origin} className="Game-iframe" />
        <GameSpritePane onChange={this.onSpriteChange} />
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