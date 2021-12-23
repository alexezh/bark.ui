import * as React from 'react';
import _ from "lodash";
import { CodeFileDef, project } from './Project';
import ToolSelectComponent from './paint/ui/ToolSelectButton';
import { IPaintEditor } from './paint/ui/PaintEditor';

export interface IPaintEditorCostumePaneProps {
  paintEditor: IPaintEditor;
  codeFile: CodeFileDef;
  onClose: any;
}

export interface IPaintEditorCostumePaneState {
  codeFile: CodeFileDef;
}

export default class PaintEditorCostumePane extends React.Component<IPaintEditorCostumePaneProps, IPaintEditorCostumePaneState> {
  constructor(props: IPaintEditorCostumePaneProps) {
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
      </div >
    );
  }
}
