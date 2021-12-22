import * as React from 'react';
import _ from "lodash";
import { CodeFileDef, project } from './Project';
import ToolSelectComponent from './paint/ui/ToolSelectButton';
import { IPaintEditor } from './paint/ui/PaintEditor';

export interface IPaintEditorToolbarProps {
  paintEditor: IPaintEditor;
  codeFile: CodeFileDef;
  onClose: any;
}

export interface IPaintEditorToolbarState {
  codeFile: CodeFileDef;
}

export default class PaintEditorToolbar extends React.Component<IPaintEditorToolbarProps, IPaintEditorToolbarState> {
  constructor(props: IPaintEditorToolbarProps) {
    super(props);

    _.bindAll(this, [
    ]);

    this.state = {
      codeFile: props.codeFile,
    }
  }

  public render() {
    return (
      <div className='PaintEditor-toolbar'>
        <ToolSelectComponent
          disabled={false}
          isSelected={false}
          command={this.props.paintEditor.getCommand('bit-brush-mode')}
        />
        <ToolSelectComponent
          disabled={false}
          isSelected={false}
          command={this.props.paintEditor.getCommand('bit-line-mode')}
        />
        <ToolSelectComponent
          disabled={false}
          isSelected={false}
          command={this.props.paintEditor.getCommand('bit-oval-mode')}
        />
        <button className='ModalEditor-close' onClick={this.props.onClose}>Close</button>
      </div >
    );
  }
}
