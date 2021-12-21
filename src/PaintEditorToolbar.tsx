import * as React from 'react';
import { CodeFileDef, project } from './Project';
import _ from "lodash";

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
        <button className='ModalEditor-close' onClick={this.props.onClose}>Close</button>
      </div>
    );
  }
}
