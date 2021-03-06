import _ from 'lodash';
import { IPaperEditor } from '../PaperEditor';

export interface IToolSelectCommand {
  componentDidMount(target: any);
  componentWillUnmount();

  onCommand();
  get isSelected();

  get imgSrc(): string;
  get text(): string;
}

export class ToolSelectCommand<T> implements IToolSelectCommand {
  protected tool: T | null = null;
  protected editor: IPaperEditor;
  private target: WeakRef<any> | null = null;
  private version: number = 1;
  private readonly _commandId: string;
  private readonly _imgSrc: string;
  private readonly _text: string;
  protected _toolMode: any;

  get imgSrc(): string {
    return this._imgSrc;
  }
  get text(): string {
    return this._text;
  }

  public constructor(editor: IPaperEditor, commandId: string, mode: any, imgSrc: string, text: string) {
    this.editor = editor;
    this._commandId = commandId;
    this._imgSrc = imgSrc;
    this._text = text;
    this._toolMode = mode;

    _.bindAll(this, [
      'onStateChanged'
    ]);
  }

  public onCommand() {
    this.editor.setState({ mode: this._toolMode });
  }

  public get isSelected() {
    return this.editor.state.mode === this._toolMode;
  }

  componentDidMount(target: any) {
    this.target = new WeakRef<any>(target);
    if (this.editor.state.mode === this._toolMode) {
      this.activateTool();
    }
    this.editor.registerStateChange(this._commandId, this.onStateChanged);
  }

  componentWillUnmount() {
    this.deactivateTool();
    this.editor.unregisterStateChange(this._commandId);
  }

  onStateChanged() {
    let isDirty = this.updateState();

    if (!this.tool && this.editor.state.mode === this._toolMode) {
      this.activateTool();
      isDirty = true;
    } else if (this.tool && this.editor.state.mode !== this._toolMode) {
      this.deactivateTool();
      isDirty = true;
    }

    if (isDirty && this.target !== null) {
      this.version++;
      let target = this.target.deref();
      if (target) {
        target.setState({ isSelected: this.isSelected })
      }
    }
  }

  updateState(): boolean {
    throw new Error('Method not implemented.');
  }

  activateTool() {
    throw new Error('Method not implemented.');
  }

  deactivateTool() {
    if (this.tool !== null) {
      // @ts-ignore
      this.tool.deactivateTool();
      // @ts-ignore
      this.tool.remove();
      this.tool = null;
    }
  }
}

