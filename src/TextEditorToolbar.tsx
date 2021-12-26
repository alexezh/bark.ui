import * as React from 'react';
import { CodeBlockDef, CodeFileDef, project } from './Project';
import _ from "lodash";
import { Dropdown } from 'react-bootstrap';

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
      'onSelectFile',
      'onSelectFunction',
      'renderFileList',
    ]);

    this.state = {
      codeBlock: props.codeBlock,
      codeFile: props.codeBlock?.parent as CodeFileDef
    }
  }

  private onSelectFile(e: any) {
    let codeFile = project.findCodeFileById(e.target.value);
    if (codeFile === undefined) {
      return;
    }

    console.log('TextEditor select:' + codeFile.name);
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

  public render() {
    return (
      <div className='TextEditor-toolbar'>
        <span>Object: </span>
        <Dropdown onClick={this.onSelectFile} key={this.state.codeFile?.id}>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Dropdown Button
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {this.renderFileList()}
          </Dropdown.Menu>
        </Dropdown>
        <span margin-left="20px">Functions: </span>
        <select onChange={this.onSelectFunction} value={this.state.codeBlock?.id}>
          {this.renderFunctionList()}
        </select>
        <button className='ModalEditor-close' onClick={this.props.onClose}>Close</button>
      </div>
    );
  }

  private renderFileList(): any[] {
    let files: any[] = [];
    project.forEachCodeFile((file) => {
      files.push((
        <Dropdown.Item key={file.path}>file.name</Dropdown.Item>
      ));
    })

    return files;
  }

  private renderFunctionList(): any[] {
    if (this.state.codeFile === undefined) {
      return [];
    }

    return [];
    /*
        let funcs: any[] = [];
        for (let idx in this.state.codeFile.codeBlocks) {
          let item = this.state.codeFile.codeBlocks[idx];
          funcs.push((
            <Dropdown.Item key={item.id}>item.name</Dropdown.Item>
          ));
        }
    
        return funcs;*/
  }

  /**
   * 
const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

const MyComponent = () => (
  <Select options={options} />
)

  */
}
