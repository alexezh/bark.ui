import * as React from 'react';
import _ from "lodash";
import * as project from '../Project';
import ToolSelectComponent from './ui/ToolSelectButton';
import List from './ui/list/list';
import ListItem from './ui/list/list-item';
import { IPaperEditor } from './PaperEditor';

import '../App.css';

export interface IPaperEditorCostumePaneProps {
  sprite: project.SpriteDef;
  onChange: (costume: project.CostumeDef) => void;
}

export interface IPaperEditorCostumePaneState {
  sprite: project.SpriteDef;
  selectedCostumeIndex: number | null;
  /**
   * selected costume
   */
  costume: project.CostumeDef;

  /**
   * fake property for updating list
   */
  version: number
}

export default class PaintEditorCostumePane extends React.Component<IPaperEditorCostumePaneProps, IPaperEditorCostumePaneState> {
  constructor(props: IPaperEditorCostumePaneProps) {
    super(props);

    _.bindAll(this, [
      'onCostumeSelected',
      'onCostumeChange',
      'renderItem'
    ]);

    this.state = {
      sprite: props.sprite,
      selectedCostumeIndex: 0,
      costume: props.sprite.costumes[0],
      version: 0
    }
  }

  componentDidMount() {
    this.state.sprite.onCostumeChange.add(this.onCostumeChange);
  }

  componentWillUnmount() {
    this.state.sprite.onCostumeChange.remove(this.onCostumeChange);
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
  private onCostumeSelected(index: number | null) {
    let costume = (index !== null) ? this.state.sprite.costumes[index] : this.state.sprite.firstCostume;
    this.setState({
      selectedCostumeIndex: index,
      costume: costume
    });

    this.props.onChange(costume);
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

  renderItem(idx: number): { item: React.ReactNode, key: string } | undefined {
    if (idx >= this.state.sprite.costumes.length) {
      return undefined;
    }
    let costume = this.state.sprite.costumes[idx];

    return {
      item: (
        <div className="Sidebar-button">
          <img className='Sidebar-button-image' src={costume.imageData?.image} />
          <div>
            <span className='Sidebar-button-text'>{costume.name}</span>
          </div>
        </div>
      ),
      key: costume.id
    };
  }
}
