import * as React from 'react';

export interface IGameEditorToolbarProps {
  onEditCode: () => void;
  onEditImages: () => void;
  onEditLevel: () => void;
  onDownloadProject: () => void;
  onStartGame: () => void;
  onStopGame: () => void;
}

export interface IGameEditorToolbarState {
}

export default class GameEditorToolbar extends React.Component<IGameEditorToolbarProps, IGameEditorToolbarState> {
  constructor(props: IGameEditorToolbarProps) {
    super(props);

    this.state = {
    }
  }

  public render() {
    return (
      <div className="Canvas-toolbar">
        <button onClick={this.props.onEditCode}>Code</button>
        <button onClick={this.props.onEditImages}>Images</button>
        <button onClick={this.props.onEditLevel}>Level</button>
        <button onClick={this.props.onDownloadProject}>Download</button>
        <button onClick={this.props.onStartGame}>Run</button>
        <button onClick={this.props.onStopGame}>Stop</button>
      </div>
    );
  }
}
