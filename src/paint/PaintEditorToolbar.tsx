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

interface SpriteValueProps {
  name?: string;
};

const SpriteValue: React.FC<SpriteValueProps> = (props) => (
  <div className='Toolbar-select-value'>
    <span>{props.name}</span>
  </div>
);

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

  private onSelectSprite(id: string) {
    let sprite = project.findSpriteById(id);
    if (sprite === undefined) {
      return;
    }

    this.setState({
      sprite: sprite,
    });
    this.props.onChange(sprite);
  }


  public render() {
    return (
      <div className='Toolbar'>
        <Button className='ModalEditor-close' onClick={this.props.onClose}>Home</Button>
        <BigButton title='Sprites'>
          <Dropdown variant='outline-primary' as={ButtonGroup} align='end'>
            <SpriteValue name={this.state.sprite.name} />
            <Dropdown.Toggle split variant="success" id="dropdown-basic" />
            <Dropdown.Menu>
              {this.renderSpriteList(this.onSelectSprite)}
            </Dropdown.Menu>
          </Dropdown>
        </BigButton>
      </div >
    );
  }

  private renderSpriteList(onClick: (id: string) => void): any[] {
    let files: any[] = [];
    project.forEachSprite((sprite) => {
      files.push((
        <Dropdown.Item key={sprite.id} onClick={() => onClick(sprite.id)}>
          <SpriteValue name={sprite.name} />
        </Dropdown.Item>
      ));
    })

    return files;
  }
}
