import * as React from 'react';
import _ from "lodash";
import { CodeFileDef, CostumeDef, project, SpriteDef } from '../Project';
import ToolSelectComponent from './ui/ToolSelectButton';
import { IPaperEditor } from './PaperEditor';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { BigButton } from '../BigButton'
import '../App.css';

export interface IPaperEditorToolbarProps {
  paintEditor: IPaperEditor;
  sprite: SpriteDef;
  onClose: any;
  onChange: (sprite: SpriteDef) => void;
}

export interface IPaperEditorToolbarState {
  sprite: SpriteDef;
}

export default class PaintEditorToolbar extends React.Component<IPaperEditorToolbarProps, IPaperEditorToolbarState> {
  constructor(props: IPaperEditorToolbarProps) {
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
      <div className='Toolbar'>
        <Button className='ModalEditor-close' onClick={this.props.onClose}>Home</Button>
        <BigButton title='Sprites'>
          <select onChange={this.onSelectSprite} value={this.state.sprite.id}>
            {this.renderSpriteList()}
          </select>
        </BigButton>
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
