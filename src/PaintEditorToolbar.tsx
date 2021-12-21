import * as React from 'react';
import _ from "lodash";
import { CodeFileDef, project } from './Project';
import ToolSelectComponent from './paint/ui/tool-select-base';
import BitBrushModeController from './paint/ui/bit-brush-mode';

export interface IPaintEditorToolbarProps {
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
          controller={new BitBrushModeController()}
        />
        <button className='ModalEditor-close' onClick={this.props.onClose}>Close</button>
      </div >
    );
  }
}
