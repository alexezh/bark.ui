import * as React from 'react';
import { CodeBlockDef, CodeFileDef, project } from './Project';
import _ from "lodash";
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { BigButton } from './BigButton'

export interface ITextEditorToolbarProps {
  codeBlock: CodeBlockDef;
  onClose: any;
  onChange: (codeBLock: CodeBlockDef | undefined) => void;
}

export interface ITextEditorToolbarState {
  codeFile?: CodeFileDef;
  codeBlock?: CodeBlockDef;
}

interface FileValueProps {
  name?: string;
};

const FileValue: React.FC<FileValueProps> = (props) => (
  <div className='Toolbar-select-value'>
    <span>{props.name}</span>
  </div>
);

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

  //private onSelectFile(eventKey: string | null, e: React.SyntheticEvent<unknown>) {
  private onSelectFile(id: string) {
    let codeFile = project.findCodeFileById(id);
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

  private onSelectFunction(id: string) {
    let codeFile = project.findCodeFileById(id);
    let codeBlock = codeFile?.firstBlock;
    this.setState({
      codeBlock: codeFile?.firstBlock,
      codeFile: codeFile
    });
    this.props.onChange(codeBlock);
  }

  public render() {
    return (
      <div className='Toolbar'>
        <Button className='ModalEditor-close' onClick={this.props.onClose}>Home</Button>
        <BigButton title='Object'>
          <Dropdown key={this.state.codeFile?.id} as={ButtonGroup} align='end'>
            <FileValue name={this.state.codeFile?.name} />
            <Dropdown.Toggle split variant="success" id="dropdown-basic" />
            <Dropdown.Menu>
              {this.renderFileList(this.onSelectFile)}
            </Dropdown.Menu>
          </Dropdown>
        </BigButton>
        <BigButton title='Functions'>
          <Dropdown key={this.state.codeBlock?.id} as={ButtonGroup} align='end'>
            <FileValue name={this.state.codeBlock?.name} />
            <Dropdown.Toggle split variant="success" id="dropdown-basic" />
            <Dropdown.Menu>
              {this.renderFunctionList(this.onSelectFunction)}
            </Dropdown.Menu>
          </Dropdown>
        </BigButton>
      </div >
    );
  }

  private renderFileList(onClick: (id: string) => void): any[] {
    let files: any[] = [];
    project.forEachCodeFile((file) => {
      files.push((
        <Dropdown.Item key={file.path} onClick={() => onClick(file.id)}>
          <FileValue name={file.name} />
        </Dropdown.Item>
      ));
    })

    return files;
  }

  private renderFunctionList(onClick: (id: string) => void): any[] {
    if (this.state.codeFile === undefined) {
      return [];
    }

    let funcs: any[] = [];
    for (let idx in this.state.codeFile.codeBlocks) {
      let item = this.state.codeFile.codeBlocks[idx];
      funcs.push((
        <Dropdown.Item key={item.id} onClick={() => onClick(item.id)}>{item.name}</Dropdown.Item >
      ));
    }

    return funcs;
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
