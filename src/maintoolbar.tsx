import * as React from 'react';

export interface IMainToolbarProps {
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

      </div>
    );
  }
}
