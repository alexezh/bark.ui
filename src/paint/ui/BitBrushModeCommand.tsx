import { MIXED } from '../tools/style-path';
import { clearSelection, getSelectedLeafItems } from '../tools/selection';
import BitBrushTool from '../tools/bit-tools/brush-tool';
import { IToolSelectCommand } from './ToolSelectButton';
import { DEFAULT_COLOR } from '../tools/colors';
import brushIcon from './brush.svg';
import Modes, { BitmapModes } from '../lib/modes';
import { IPaintEditor } from './PaintEditor';

/*
onst BitLineComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.line}
        imgSrc={lineIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

BitLineComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};
 */

export const BitBrushModeCommand_commandId: string = 'bit-brush-mode';

export default class BitBrushModeCommand implements IToolSelectCommand {
    private tool: BitBrushTool | null = null;
    private editor: IPaintEditor;
    private target: WeakRef<any> | null = null;
    private version: number = 1;

    get imgSrc(): string {
        return brushIcon;
    }
    get text(): string {
        return 'hello';
    }

    public constructor(editor: IPaintEditor) {
        this.editor = editor;
    }

    private isActive() {
        return this.editor.mode === Modes.BIT_BRUSH;
    }

    componentDidMount(target: any) {
        this.target = new WeakRef<any>(target);
        if (this.isActive()) {
            this.activateTool();
        }
        this.editor.registerStateChange(BitBrushModeCommand_commandId, this.onStateChange.bind(this));
    }

    onStateChange() {
        let isDirty = false;
        if (this.tool && this.tool.color !== this.editor.color) {
            this.tool.setColor(this.editor.color);
        }
        if (this.tool && this.tool.size !== this.editor.bitBrushSize) {
            this.tool.setBrushSize(this.editor.bitBrushSize);
        }

        if (!this.tool && this.isActive()) {
            this.activateTool();
        } else if (this.tool && !this.isActive()) {
            this.deactivateTool();
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
        //clearSelection(props.clearSelectedItems);
        // this.clearGradient();
        // Force the default brush color if fill is MIXED or transparent
        let color = this.editor.color;
        if (!color || color === MIXED) {
            // this.props.onChangeFillColor(DEFAULT_COLOR);
            color = DEFAULT_COLOR;
        }

        // @ts-ignore
        this.tool = new BitBrushTool(
            this.editor.handleUpdateImage
        );
        this.tool.setColor(color);
        this.tool.setBrushSize(this.editor.bitBrushSize);

        this.tool.activate();
    }
    deactivateTool() {
        if (this.tool !== null) {
            this.tool.deactivateTool();
            this.tool.remove();
            this.tool = null;
        }
    }
    onCommand() {
        this.editor.setState({ mode: Modes.BIT_BRUSH });
    }
}

