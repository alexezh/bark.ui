import * as React from 'react';
import _ from "lodash";
import { CodeFileDef, project } from '../Project';
import ToolSelectComponent from './ui/ToolSelectButton';
import { IPaintEditor } from './PaintEditor';

export interface IPaintEditorSidebarProps {
  paintEditor: IPaintEditor;
  codeFile: CodeFileDef;
  onClose: any;
  onChange: any;
}

export interface IPaintEditorSidebarState {
  codeFile: CodeFileDef;
}

export default class PaintEditorSidebar extends React.Component<IPaintEditorSidebarProps, IPaintEditorSidebarState> {
  constructor(props: IPaintEditorSidebarProps) {
    super(props);

    _.bindAll(this, [
    ]);

    this.state = {
      codeFile: props.codeFile,
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
