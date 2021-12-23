import * as React from 'react';
import _ from "lodash";
import { CodeFileDef, project, SpriteDef } from '../Project';
import ToolSelectComponent from './ui/ToolSelectButton';
import List, { ListItem } from 'react-list-select';
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
          <List>
            {
              this.renderCostumeList()
            }
          </List>
        </div >
      </div >
    );
  }

  renderItem(text) {
    return (
      <div className="contact">
        <span className="name">{text}</span>
      </div>
    )
  }
  

let example4 = (
  <List
    items={comps}
    disabled={[2]}
    selected={[0]}
    onChange={console.log.bind(console)}
  />
)

  private renderCostumeList(): any[] {
  let costumes: any[] = [];
  for (let i = 0; i < this.state.sprite.costumes.length; i++) {
    let costume = this.state.sprite.costumes[i];
    costumes.push((
      <ListItem key={costume.id}>{costume.name}</ListItem>
    ));
  }

  return costumes;
}
}
