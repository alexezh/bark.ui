import * as React from 'react';
import _ from "lodash";
import { CodeFileDef, project, SpriteDef } from '../Project';
import ToolSelectComponent from './ui/ToolSelectButton';
import List from './ui/list/list';
import ListItem from './ui/list/list-item';
import { IPaintEditor } from './PaintEditor';

export interface IPaintEditorCostumePaneProps {
  paintEditor: IPaintEditor;
  sprite: SpriteDef;
}

export interface IPaintEditorCostumePaneState {
  sprite: SpriteDef;
}

export default class PaintEditorCostumePane extends React.Component<IPaintEditorCostumePaneProps, IPaintEditorCostumePaneState> {
  constructor(props: IPaintEditorCostumePaneProps) {
    super(props);

    _.bindAll(this, [
    ]);

    this.state = {
      sprite: props.sprite,
    }
  }

  public render() {
    return (
      <div className='PaintEditor-costume'>
        <div>
          <List
            itemCount={this.state.sprite.costumes.length}
            render={(index) => this.renderItem(index)}
            selectedItem={0}
            onChange={console.log.bind(console)} />
        </div >
      </div >
    );
  }

  renderItem(idx: number): { item: React.ReactNode, key: string } | undefined {
    if (idx >= this.state.sprite.costumes.length) {
      return undefined;
    }
    let costume = this.state.sprite.costumes[idx];

    return {
      item: (
        <div className="contact">
          <span className="name">{costume.name}</span>
        </div>
      ), key: costume.id
    };
  }
}
