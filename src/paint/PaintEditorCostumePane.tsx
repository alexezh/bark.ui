import * as React from 'react';
import _ from "lodash";
import { CodeFileDef, CostumeDef, project, SpriteDef } from '../Project';
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
  selectedCostumeIndex: number | null;
  /**
   * selected costume
   */
  costume: CostumeDef;
  /**
   * image id in the costume. if it changes, editing happened
   */
  imageId: string | undefined;
}

export default class PaintEditorCostumePane extends React.Component<IPaintEditorCostumePaneProps, IPaintEditorCostumePaneState> {
  private editor: IPaintEditor;

  constructor(props: IPaintEditorCostumePaneProps) {
    super(props);

    _.bindAll(this, [
      'onEditorStateChange',
      'onCostumeSelected',
      'renderItem'
    ]);

    this.editor = props.paintEditor;
    this.state = {
      sprite: props.sprite,
      selectedCostumeIndex: 0,
      costume: props.sprite.costumes[0],
      imageId: props.sprite.costumes[0].imageId
    }
  }

  componentDidMount() {
    this.editor.registerStateChange('PaintEditorCostumePane', this.onEditorStateChange);
  }

  componentWillUnmount() {
  }

  componentWillReceiveProps(newProps) {
  }

  private onEditorStateChange() {
    if (this.state.imageId !== this.editor.state.image?.imageId) {
      this.setState({ imageId: this.editor.state.image?.imageId })
    }
  }

  public render() {
    return (
      <div className='PaintEditor-costume'>
        <List
          itemCount={this.state.sprite.costumes.length}
          render={(index) => this.renderItem(index)}
          selectedItem={this.state.selectedCostumeIndex}
          onChange={this.onCostumeSelected} />
      </div >
    );
  }

  private onCostumeSelected(index: number | null) {
    this.setState({ selectedCostumeIndex: index })
  }

  renderItem(idx: number): { item: React.ReactNode, key: string } | undefined {
    if (idx >= this.state.sprite.costumes.length) {
      return undefined;
    }
    let costume = this.state.sprite.costumes[idx];

    return {
      item: (
        <div className="contact">
          <img src={costume.image} />
          <span className="name">{costume.name}</span>
        </div>
      ),
      key: costume.id
    };
  }
}
