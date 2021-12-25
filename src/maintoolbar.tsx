import * as React from 'react';

export interface IMainToolbarProps {
  onEditCode: () => void;
  onEditImages: () => void;
  onEditLevel: () => void;
  onDownloadProject: () => void;
}

export interface IMainToolbarState {
}

export default class MainToolbar extends React.Component<IMainToolbarProps, IMainToolbarState> {
  constructor(props: IMainToolbarProps) {
    super(props);

    this.state = {
    }
  }

  public render() {
    return (
      <div className="Canvas-maintoolbar">
        <button onClick={this.props.onEditCode}>Code</button>
        <button onClick={this.props.onEditImages}>Images</button>
        <button onClick={this.props.onEditLevel}>Level</button>
        <button onClick={this.props.onDownloadProject}>Download</button>
      </div>
    );
  }
}
