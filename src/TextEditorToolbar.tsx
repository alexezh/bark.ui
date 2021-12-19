import * as React from 'react';
import { CodeFileDef, project } from './Project';
import _ from "lodash";

export interface ITextEditorToolbarProps {
  codeFile?: CodeFileDef;
  onClose: any;
}

export interface ITextEditorToolbarState {
  code: string
}

export default class TextEditorToolbar extends React.Component<ITextEditorToolbarProps, ITextEditorToolbarState> {
  constructor(props: ITextEditorToolbarProps) {
    super(props);

    _.bindAll(this, [
      'onSelectObject',
    ]);

    this.state = {
      code: ''
    }
  }

  public render() {
    return (
      <div className='TextEditor-toolbar'>
        <span>Object: </span>
        <select onSelect={this.onSelectObject}>
          {this.renderObjectList()}
        </select>
        <span>Functions: </span>
        <select>
          {this.renderFunctionList()}
        </select>
        <button className='ModalEditor-close' onClick={this.props.onClose}>Close</button>
      </div>
    );
  }

  private onSelectObject(event: any) {
    console.log(event);
  }

  private renderFunctionList(): any[] {
    if (this.props.codeFile === undefined) {
      return [];
    }

    let funcs: any[] = [];
    for (let item in this.props.codeFile.code) {
      funcs.push((
        <option key={item}>{item}</option>
      ));
    }

    return funcs;
  }

  private renderObjectList(): any[] {
    let files: any[] = [];
    project.forEachCodeFile((file) => {
      files.push((
        <option key={file.name}>{file.name}</option>
      ));
    })

    return files;
  }
}
