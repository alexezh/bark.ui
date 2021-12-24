import * as React from 'react';
import { CodeBlockDef, CodeFileDef, project } from './Project';
import _ from "lodash";

export interface ITextEditorToolbarProps {
  codeBlock: CodeBlockDef;
  onClose: any;
  onChange: (codeBLock: CodeBlockDef | undefined) => void;
}

export interface ITextEditorToolbarState {
  codeFile?: CodeFileDef;
  codeBlock?: CodeBlockDef;
}

export default class TextEditorToolbar extends React.Component<ITextEditorToolbarProps, ITextEditorToolbarState> {
  constructor(props: ITextEditorToolbarProps) {
    super(props);

    _.bindAll(this, [
      'onSelectObject',
      'onSelectFunction'
    ]);

    this.state = {
      codeBlock: props.codeBlock,
      codeFile: props.codeBlock?.parent as CodeFileDef
    }
  }

  public render() {
    return (
      <div className='TextEditor-toolbar'>
        <span>Object: </span>
        <select onChange={this.onSelectFile} value={this.state.codeFile?.id}>
          {this.renderFileList()}
        </select>
        <span margin-left="20px">Functions: </span>
        <select onChange={this.onSelectFunction} value={this.state.codeBlock?.id}>
          {this.renderFunctionList()}
        </select>
        <button className='ModalEditor-close' onClick={this.props.onClose}>Close</button>
      </div>
    );
  }

  private onSelectFile(e: any) {
    let codeFile = project.findCodeFileById(e.target.value);
    if (codeFile === undefined) {
      return;
    }

    this.setState({
      codeFile: codeFile,
      codeBlock: codeFile.firstBlock
    });
    this.props.onChange(codeFile.firstBlock);
  }

  private onSelectFunction(e: any) {
    let codeFile = project.findCodeFileById(e.target.value);
    let codeBlock = codeFile?.firstBlock;
    this.setState({
      codeBlock: codeFile?.firstBlock,
      codeFile: codeFile
    });
    this.props.onChange(codeBlock);
  }

  private renderFunctionList(): any[] {
    if (this.state.codeFile === undefined) {
      return [];
    }

    let funcs: any[] = [];
    for (let idx in this.state.codeFile.codeBlocks) {
      let item = this.state.codeFile.codeBlocks[idx];
      funcs.push((
        <option key={item.id}>{item.name}</option>
      ));
    }

    return funcs;
  }

  private renderFileList(): any[] {
    let files: any[] = [];
    project.forEachCodeFile((file) => {
      files.push((
        <option key={file.path}>{file.name}</option>
      ));
    })

    return files;
  }
}
