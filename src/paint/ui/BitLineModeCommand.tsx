import { MIXED } from '../tools/style-path';
import { clearSelection, getSelectedLeafItems } from '../tools/selection';
import BitLineTool from '../tools/bit-tools/line-tool';
import { IToolSelectCommand } from './ToolSelectButton';
import { DEFAULT_COLOR } from '../tools/colors';
import lineIcon from './line.svg';
import Modes, { BitmapModes } from '../lib/modes';
import { IPaintEditor } from './PaintEditor';


export const BitLineModeCommand_commandId: string = 'bit-line-mode';

export default class BitLineModeCommand implements IToolSelectCommand {
    private tool: BitLineTool | null = null;
    private editor: IPaintEditor;
    private target: WeakRef<any> | null = null;
    private version: number = 1;

    get imgSrc(): string {
        return lineIcon;
    }
    get text(): string {
        return 'hello';
    }

    public constructor(editor: IPaintEditor) {
        this.editor = editor;
    }

    onCommand() {
        this.editor.setState({ mode: Modes.BIT_LINE });
    }

    componentDidMount(target: any) {
        this.target = new WeakRef<any>(target);
        if (this.editor.mode === Modes.BIT_LINE) {
            this.activateTool();
        }
    }
    onStateChanged() {
        let isDirty: boolean = false;
        if (this.tool && this.tool.color !== this.editor.color) {
            this.tool.setColor(this.editor.color);
            isDirty = true;
        }
        if (this.tool && this.tool.size !== this.editor.bitBrushSize) {
            this.tool.setLineSize(this.editor.bitBrushSize);
            isDirty = true;
        }

        if (!this.tool && this.editor.mode === Modes.BIT_LINE) {
            this.activateTool();
            isDirty = true;
        } else if (this.tool && this.editor.mode !== Modes.BIT_LINE) {
            this.deactivateTool();
            isDirty = true;
        }

        this.version++;
        if (isDirty && this.target !== null) {
            let target = this.target.deref();
            if (target) {
                target.setState({ version: this.version })
            }
        }
    }
    componentWillUnmount() {
        this.deactivateTool();
    }
    activateTool() {
        // clearSelection(props.clearSelectedItems);
        //props.clearGradient();
        // Force the default line color if fill is MIXED or transparent
        let color = this.editor.color;
        if (!color || color === MIXED) {
            //props.onChangeFillColor(DEFAULT_COLOR);
            color = DEFAULT_COLOR;
        }
        this.tool = new BitLineTool(
            this.editor.handleUpdateImage
        );
        this.tool.setColor(color);
        this.tool.setLineSize(this.editor.bitBrushSize);

        this.tool.activate();
    }
    deactivateTool() {
        if (this.tool !== null) {
            this.tool.deactivateTool();
            this.tool.remove();
            this.tool = null;
        }
    }
}

