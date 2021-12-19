import * as React from 'react';
import { CodeFileDef } from './Project';
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
      'onCodeChange',
    ]);

    this.state = {
      code: ''
    }
  }

  public render() {
    return (
      <div className='TextEditor-toolbar'>
        <div>Object: </div>
        <select>
          {this.renderFunctionList()}
        </select>
      </div>
    );
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

  private onCodeChange(event: any) {
    this.setState({ code: event.target.value });
  }
}
