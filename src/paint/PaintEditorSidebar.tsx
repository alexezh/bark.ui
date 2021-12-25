import * as React from 'react';
import _ from "lodash";
import { CodeFileDef, CostumeDef, project, SpriteDef } from '../Project';
import ToolSelectComponent from './ui/ToolSelectButton';
import { IPaperEditor } from './PaperEditor';

export interface IPaperEditorSidebarProps {
  paintEditor: IPaperEditor;
  sprite: SpriteDef;
  onClose: any;
  onChange: (costume: CostumeDef) => void;
}

export interface IPaperEditorSidebarState {
  sprite: SpriteDef;
  costume: CostumeDef;
}

export default class PaintEditorSidebar extends React.Component<IPaperEditorSidebarProps, IPaperEditorSidebarState> {
  constructor(props: IPaperEditorSidebarProps) {
    super(props);

    _.bindAll(this, [
    ]);

    this.state = {
      sprite: props.sprite,
      costume: props.sprite.firstCostume
    }
  }

  public render() {
    return (
      <div className='PaintEditor-sidebar'>
        <ToolSelectComponent
          className='Sidebar-button'
          disabled={false}
          isSelected={false}
          command={this.props.paintEditor.getCommand('bit-brush-mode')}
        />
        <ToolSelectComponent
          className='Sidebar-button'
          disabled={false}
          isSelected={false}
          command={this.props.paintEditor.getCommand('bit-line-mode')}
        />
        <ToolSelectComponent
          className='Sidebar-button'
          disabled={false}
          isSelected={false}
          command={this.props.paintEditor.getCommand('bit-oval-mode')}
        />
      </div >
    );
  }
}
