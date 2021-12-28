import * as React from 'react';
import _ from "lodash";

import * as project from './Project';
import workspace from './Workspace';
import GameSpritePane from './GameSpritePane';
import GameEditorToolbar from './GameEditorToolbar';
import { StorageOp } from './ProjectStorage';


export interface IGameScreenProps {
}

export interface IGameScreenState {
}

export default class GameScreen extends React.Component<IGameScreenProps, IGameScreenState> {
  private container: any;

  constructor(props: IGameScreenProps) {
    super(props);

    _.bindAll(this, [
    ]);

    this.state = {
    }
  }

  public componentDidMount() {
  }

  public render() {
    return (
      <div />
    );
  }
}

