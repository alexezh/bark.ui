import * as React from 'react';
import _ from "lodash";
import NumericInput from 'react-numeric-input';
import { HexColorPicker } from "react-colorful";
import { CodeFileDef, CostumeDef, project, SpriteDef } from '../Project';
import ToolSelectComponent from './ui/ToolSelectButton';
import { IPaperEditor } from './PaperEditor';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { BigButton } from '../BigButton'
import '../App.css';

export interface IPaperEditorToolbarProps {
  editor: IPaperEditor;
  sprite: SpriteDef;
  onClose: any;
  onChange: (sprite: SpriteDef) => void;
}

export interface IPaperEditorToolbarState {
  sprite: SpriteDef;
  bitBrushSize: number;
  bitEraserSize: number;
}

interface SpriteValueProps {
  name?: string;
};

const SpriteValue: React.FC<SpriteValueProps> = (props) => (
  <div className='Toolbar-select-value' style={{ width: '10em' }}>
    <span>{props.name}</span>
  </div>
);

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const ColorPickerMenu = React.forwardRef(
  ({ children }, ref) => {

    return (
      //      <HexColorPicker color={color} onChange={setColor} />;
      <HexColorPicker />
    );
  },
);

export default class PaintEditorToolbar extends React.Component<IPaperEditorToolbarProps, IPaperEditorToolbarState> {
  constructor(props: IPaperEditorToolbarProps) {
    super(props);

    _.bindAll(this, [
      'onSelectSprite',
      'onBrushSizeChange',
      'onEraserSizeChange'
    ]);

    this.state = {
      sprite: props.sprite,
      bitBrushSize: this.props.editor.state.bitBrushSize,
      bitEraserSize: this.props.editor.state.bitEraserSize
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

  private onBrushSizeChange(valueAsNumber: number) {
    this.props.editor.setState({ bitBrushSize: valueAsNumber });
    this.setState({ bitBrushSize: valueAsNumber });
  }

  private onEraserSizeChange(valueAsNumber: number) {
    this.props.editor.setState({ bitEraserSize: valueAsNumber });
    this.setState({ bitEraserSize: valueAsNumber });
  }

  public render() {
    return (
      <div className='Toolbar'>
        <Button className='ModalEditor-close' onClick={this.props.onClose}>Home</Button>
        <BigButton title='Sprites'>
          <Dropdown variant='outline-primary' size='sm' as={ButtonGroup} align='end'>
            <SpriteValue name={this.state.sprite.name} />
            <Dropdown.Toggle split variant="success" id="dropdown-basic" />
            <Dropdown.Menu>
              {this.renderSpriteList(this.onSelectSprite)}
            </Dropdown.Menu>
          </Dropdown>
        </BigButton>

        <BigButton title='Brush size'>
          <NumericInput
            min={1}
            max={100}
            value={this.state.bitBrushSize}
            onChange={this.onBrushSizeChange}
            style={{ width: '5em', height: '100%', input: { width: '5em ' } }} />
        </BigButton>

        <BigButton title='Eraser size'>
          <NumericInput
            min={1}
            max={100}
            value={this.state.bitEraserSize}
            onChange={this.onEraserSizeChange}
            style={{ width: '5em', height: '100%', input: { width: '5em ' } }} />
        </BigButton>

        <BigButton title='Back'>
          <Dropdown variant='outline-primary' size='sm' as={ButtonGroup} align='end'>
            <Dropdown.Toggle split variant="success" id="dropdown-basic" />
            <Dropdown.Menu as={ColorPickerMenu}>
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
