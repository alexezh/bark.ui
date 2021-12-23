import * as React from 'react';
import _ from "lodash";
import { CodeFileDef, project, SpriteDef } from './Project';
import ToolSelectComponent from './paint/ui/ToolSelectButton';
import { IPaintEditor } from './paint/ui/PaintEditor';

export interface IPaintEditorCostumePaneProps {
  paintEditor: IPaintEditor;
  sprite: SpriteDef;
  onClose: any;
}

export interface IPaintEditorCostumePaneState {
  sprite: SpriteDef;
}

export default class PaintEditorCostumePane extends React.Component<IPaintEditorCostumePaneProps, IPaintEditorCostumePaneState> {
  constructor(props: IPaintEditorCostumePaneProps) {
    super(props);

    _.bindAll(this, [
    ]);

    this.state = {
      sprite: props.sprite,
    }
  }

  public render() {
    return (
      <div className='PaintEditor-costume'>
        <div>
          <ul>
          </ul>
        </div >
      </div >
    );
  }

  private renderCostumeList(): any[] {
    let files: any[] = [];
    project.forEachSprite((file) => {
      files.push((
        <option key={file.name}>{file.name}</option>
      ));
    })

    return files;
  }
}
