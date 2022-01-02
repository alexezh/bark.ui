import * as React from 'react';
import _ from "lodash";
//import List from './paint/ui/list/list';
//import ListItem from './paint/ui/list/list-item';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import * as bark from 'bark-core';

import './App.css';
import workspace from './Workspace';

export interface IGameSpritePaneProps {
  onChange: (sprite: bark.SpriteDef) => void;
}

export interface IGameSpritePaneState {
  selectedSpriteId: string | null;

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
      //      'onClick'
    ]);

    // let sprite = (props.sprite !== undefined) ? props.sprite : project.project.def.sprites[0];
    this.state = {
      selectedSpriteId: null,
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
  private onCostumeChange(costume: bark.CostumeDef) {
    this.setState({ version: this.state.version + 1 })
  }

  /**
   * called when new costume is selected
   */
  private onSpriteSelected(id: string) {
    console.log('Select sprite:' + id);
    //    let sprite = (index !== null) ? project.project.def.sprites[index] : project.project.def.sprites[0];
    let sprite = workspace.project.findSpriteById(id);
    if (sprite === undefined) {
      return;
    }

    this.setState({
      selectedSpriteId: id,
    });

    this.props.onChange(sprite);
  }

  //</div>          onChange={this.onSpriteSelected} >

  public render() {
    return (
      <div className='Game-spritepane'>
        <List>
          {workspace.project.screen.sprites.map((sprite) => {
            if (sprite.costumes.length > 0 && sprite.costumes[0].imageData !== undefined) {
              return (
                <ListItemButton key={sprite.id} selected={sprite.id === this.state.selectedSpriteId} onClick={() => this.onSpriteSelected(sprite.id)}>
                  <div className="Game-spritepane-button">
                    <img className='Game-spritepane-button-image' src={sprite.costumes[0].imageData.image} />
                    <div>
                      <span className='Game-spritepane-button-text'>{sprite.name}</span>
                    </div>
                  </div>
                </ListItemButton>
              )
            } else {
              return null;
            }
          })
          }
        </List>
      </div>
    );
  }

  /*
  renderItems() {

    return {
      item: (
        <div className="Game-spritepane-button">
          <img className='Game-spritepane-button-image' src={costume.imageData?.image} />
          <div>
            <span className='Game-spritepane-button-text'>{costume.name}</span>
          </div>
        </div>
      ),
      key: costume.id
    };
  }

  public render() {
    return (
      <ImageList variant="masonry" cols={3} gap={8} style={{ width: 64 * 3 + 8 * 2 }}>
        {project.project.def.sprites.map((sprite) => (
          (sprite.costumes.length > 0) ?
            <ImageListItem key={sprite.id} onClick={this.onClick}>
              <img
                // @ts-ignore
                src={sprite.costumes[0].imageData?.image}
                loading="lazy"
                style={{ width: 64, height: 64 }}
              />
              <ImageListItemBar position="below" title={sprite.name} />
            </ImageListItem> : null
        ))}
      </ImageList>
    );
  }
  */
}
