import * as React from 'react';
import { Button } from 'react-bootstrap';

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
        <Button className='Toolbar-button' variant='outline-primary' onClick={this.props.onEditCode}>Code</Button>
        <Button className='Toolbar-button' variant='outline-primary' onClick={this.props.onEditImages}>Images</Button>
        <Button className='Toolbar-button' variant='outline-primary' onClick={this.props.onEditLevel}>Level</Button>
        <Button className='Toolbar-button' variant='outline-primary' onClick={this.props.onDownloadProject}>Download</Button>
        <Button className='Toolbar-button-startgroup' variant='outline-primary' onClick={this.props.onStartGame}>Run</Button>
        <Button className='Toolbar-button' variant='outline-primary' onClick={this.props.onStopGame}>Stop</Button>
      </div>
    );
  }
}
