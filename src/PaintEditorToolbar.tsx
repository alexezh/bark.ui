import * as React from 'react';
import _ from "lodash";
import { CodeFileDef, project } from './Project';
import ToolSelectComponent from './paint/ui/ToolSelectButton';
import { IPaintEditor } from './paint/ui/PaintEditor';

export interface IPaintEditorToolbarProps {
  paintEditor: IPaintEditor;
  codeFile: CodeFileDef;
  onClose: any;
  onChange: () => void;
}

export interface IPaintEditorToolbarState {
  codeFile: CodeFileDef;
  currentObject: any;
}

export default class PaintEditorToolbar extends React.Component<IPaintEditorToolbarProps, IPaintEditorToolbarState> {
  constructor(props: IPaintEditorToolbarProps) {
    super(props);

    _.bindAll(this, [
    ]);

    this.state = {
      codeFile: props.codeFile,
      currentObject: undefined
    }
  }

  public render() {
    return (
      <div className='PaintEditor-toolbar'>
        <span>Sprites: </span>
        <select onChange={this.onSelectObject} value={this.state.currentObject}>
          {this.renderSpriteList()}
        </select>
        <button className='ModalEditor-close' onClick={this.props.onClose}>Close</button>
      </div >
    );
  }

  private onSelectObject(e: any) {
    let codeFile = project.findCodeFile(e.target.value);
    if (codeFile === undefined) {
      return;
    }

    let blockId = CodeFileDef.getLastEditedBlockId(codeFile);
    this.setState({
      codeFile: codeFile,
      currentObject: e.target.value,
    });
    this.props.onChange();
  }

  private renderSpriteList(): any[] {
    let files: any[] = [];
    project.forEachSprite((sprite) => {
      files.push((
        <option key={sprite.id}>{sprite.name}</option>
      ));
    })

    return files;
  }
}
