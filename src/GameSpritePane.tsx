import * as React from 'react';
import _ from "lodash";
import List from './paint/ui/list/list';
import ListItem from './paint/ui/list/list-item';
import * as project from './Project';

import './App.css';

export interface IGameSpritePaneProps {
  sprite?: project.SpriteDef;
  onChange: (sprite: project.SpriteDef) => void;
}

export interface IGameSpritePaneState {
  sprite: project.SpriteDef;
  selectedSpriteIndex: number | null;

  /**
   * fake property for updating list
   */
  version: number;
}

export default class GameSpritePane extends React.Component<IGameSpritePaneProps, IGameSpritePaneState> {
  constructor(props: IGameSpritePaneProps) {
    super(props);

    _.bindAll(this, [
      'onSpriteSelected',
      'onCostumeChange',
      'renderItem'
    ]);

    let sprite = (props.sprite !== undefined) ? props.sprite : project.project.def.sprites[0];
    this.state = {
      sprite: sprite,
      selectedSpriteIndex: 0,
      version: 0
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentWillReceiveProps(newProps) {
  }

  /**
   * called when image on any costume changes
   */
  private onCostumeChange(costume: project.CostumeDef) {
    this.setState({ version: this.state.version + 1 })
  }

  /**
   * called when new costume is selected
   */
  private onSpriteSelected(index: number | null) {
    let sprite = (index !== null) ? project.project.def.sprites[index] : project.project.def.sprites[0];
    this.setState({
      selectedSpriteIndex: index,
      sprite: sprite
    });

    this.props.onChange(sprite);
  }

  public render() {
    return (
      <div className='Game-spritepane'>
        <List
          itemCount={this.state.sprite.costumes.length}
          render={(index) => this.renderItem(index)}
          selectedItem={this.state.selectedSpriteIndex}
          onChange={this.onSpriteSelected} />
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
        <div className="Game-spritepane-button">
          <img className='Game-spritepane-button-button-image' src={costume.imageData?.image} />
          <div>
            <span className='Game-spritepane-button-text'>{costume.name}</span>
          </div>
        </div>
      ),
      key: costume.id
    };
  }
}
