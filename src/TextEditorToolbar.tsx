import * as React from 'react';
import { CodeFileDef, project } from './Project';
import _ from "lodash";

export interface ITextEditorToolbarProps {
  codeFile: CodeFileDef;
  onClose: any;
  onChange: (file: CodeFileDef, block?: string) => void;
}

export interface ITextEditorToolbarState {
  codeFile: CodeFileDef;
  currentObject: any;
  currentFunction: any;
}

export default class TextEditorToolbar extends React.Component<ITextEditorToolbarProps, ITextEditorToolbarState> {
  constructor(props: ITextEditorToolbarProps) {
    super(props);

    _.bindAll(this, [
      'onSelectObject',
      'onSelectFunction'
    ]);

    this.state = {
      codeFile: props.codeFile,
      currentObject: undefined,
      currentFunction: undefined,
    }
  }

  public render() {
    return (
      <div className='TextEditor-toolbar'>
        <span>Object: </span>
        <select onChange={this.onSelectObject} value={this.state.currentObject}>
          {this.renderObjectList()}
        </select>
        <span margin-left="20px">Functions: </span>
        <select onChange={this.onSelectFunction} value={this.state.currentFunction}>
          {this.renderFunctionList()}
        </select>
        <button className='ModalEditor-close' onClick={this.props.onClose}>Close</button>
      </div>
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
      currentFunction: blockId
    });
    this.props.onChange(codeFile, blockId);
  }

  private onSelectFunction(e: any) {
    this.setState({
      currentFunction: e.target.value
    });
    this.props.onChange(this.state.codeFile, e.target.value);
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
