import * as React from 'react';
import _ from "lodash";
import { CodeFileDef, CostumeDef, project, SpriteDef } from '../Project';
import ToolSelectComponent from './ui/ToolSelectButton';
import { IPaintEditor } from './PaintEditor';
import '../App.css';

export interface IPaintEditorToolbarProps {
  paintEditor: IPaintEditor;
  sprite: SpriteDef;
  onClose: any;
  onChange: (sprite: SpriteDef) => void;
}

export interface IPaintEditorToolbarState {
  sprite: SpriteDef;
}

export default class PaintEditorToolbar extends React.Component<IPaintEditorToolbarProps, IPaintEditorToolbarState> {
  constructor(props: IPaintEditorToolbarProps) {
    super(props);

    _.bindAll(this, [
      'onSelectSprite'
    ]);

    this.state = {
      sprite: props.sprite,
    }
  }

  public render() {
    return (
      <div className='PaintEditor-toolbar'>
        <span>Sprites: </span>
        <select onChange={this.onSelectSprite} value={this.state.sprite.id}>
          {this.renderSpriteList()}
        </select>
        <button className='ModalEditor-close' onClick={this.props.onClose}>Close</button>
      </div >
    );
  }

  private onSelectSprite(e: any) {
    let sprite = project.findSpriteById(e.target.value);
    if (sprite === undefined) {
      return;
    }

    this.setState({
      sprite: sprite,
    });
    this.props.onChange(sprite);
  }

  private renderSpriteList(): any[] {
    let files: any[] = [];
    project.forEachSprite((sprite) => {
      files.push((
        <option key={sprite.id}>{sprite.name}</option>
      ));
    })

    return files;
  }
}
