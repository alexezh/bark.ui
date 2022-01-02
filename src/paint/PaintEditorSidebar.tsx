import * as React from 'react';
import _ from "lodash";
import * as project from 'bark-core';
import ToolSelectComponent from './ui/ToolSelectButton';
import { IPaperEditor } from './PaperEditor';

export interface IPaperEditorSidebarProps {
  paintEditor: IPaperEditor;
  sprite: project.SpriteDef;
  onClose: any;
  onChange: (costume: project.CostumeDef) => void;
}

export interface IPaperEditorSidebarState {
  sprite: project.SpriteDef;
  costume: project.CostumeDef;
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
          command={this.props.paintEditor.getCommand('bit-select-mode')}
        />
        <ToolSelectComponent
          className='Sidebar-button'
          command={this.props.paintEditor.getCommand('bit-brush-mode')}
        />
        <ToolSelectComponent
          className='Sidebar-button'
          command={this.props.paintEditor.getCommand('bit-line-mode')}
        />
        <ToolSelectComponent
          className='Sidebar-button'
          command={this.props.paintEditor.getCommand('bit-oval-mode')}
        />
        <ToolSelectComponent
          className='Sidebar-button'
          command={this.props.paintEditor.getCommand('bit-rect-mode')}
        />
        <ToolSelectComponent
          className='Sidebar-button'
          command={this.props.paintEditor.getCommand('bit-eraser-mode')}
        />
        <ToolSelectComponent
          className='Sidebar-button'
          command={this.props.paintEditor.getCommand('bit-text-mode')}
        />
      </div >
    );
  }
}
