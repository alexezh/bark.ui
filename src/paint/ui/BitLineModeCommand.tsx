import { MIXED } from '../tools/style-path';
import { clearSelection, getSelectedLeafItems } from '../tools/selection';
import BitBrushTool from '../tools/bit-tools/brush-tool';
import { IToolSelectCommand } from './ToolSelectButton';
import { DEFAULT_COLOR } from '../tools/colors';
import brushIcon from './brush.svg';
import Modes, { BitmapModes } from '../lib/modes';
import { IPaintEditor } from './PaintEditor';


export class BitLineModeCommand implements IToolSelectCommand {
    private tool: BitBrushTool | null = null;
    private editor: IPaintEditor;

    get imgSrc(): string {
        return brushIcon;
    }
    get text(): string {
        return 'hello';
    }

    public constructor(editor: IPaintEditor) {
        this.editor = editor;
    }

    componentDidMount() {
        if (this.props.isBitLineModeActive) {
            this.activateTool(this.props);
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.tool && nextProps.color !== this.props.color) {
            this.tool.setColor(nextProps.color);
        }
        if (this.tool && nextProps.bitBrushSize !== this.props.bitBrushSize) {
            this.tool.setLineSize(nextProps.bitBrushSize);
        }

        if (nextProps.isBitLineModeActive && !this.props.isBitLineModeActive) {
            this.activateTool();
        } else if (!nextProps.isBitLineModeActive && this.props.isBitLineModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate(nextProps) {
        return nextProps.isBitLineModeActive !== this.props.isBitLineModeActive;
    }
    componentWillUnmount() {
        if (this.tool) {
            this.deactivateTool();
        }
    }
    activateTool() {
        clearSelection(this.props.clearSelectedItems);
        this.props.clearGradient();
        // Force the default line color if fill is MIXED or transparent
        let color = this.props.color;
        if (!color || color === MIXED) {
            this.props.onChangeFillColor(DEFAULT_COLOR);
            color = DEFAULT_COLOR;
        }
        this.tool = new BitLineTool(
            this.props.onUpdateImage
        );
        this.tool.setColor(color);
        this.tool.setLineSize(this.props.bitBrushSize);

        this.tool.activate();
    }
    deactivateTool() {
        this.tool.deactivateTool();
        this.tool.remove();
        this.tool = null;
    }
    render() {
        return (
            <BitLineModeComponent
                isSelected={this.props.isBitLineModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

