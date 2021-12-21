import { MIXED } from '../tools/style-path';
import { clearSelection, getSelectedLeafItems } from '../tools/selection';
import BitLineTool from '../tools/bit-tools/line-tool';
import { IToolSelectCommand } from './ToolSelectButton';
import { DEFAULT_COLOR } from '../tools/colors';
import lineIcon from './line.svg';
import Modes, { BitmapModes } from '../lib/modes';
import { IPaintEditor } from './PaintEditor';


export default class BitLineModeCommand implements IToolSelectCommand {
    private tool: BitLineTool | null = null;
    private editor: IPaintEditor;

    get imgSrc(): string {
        return lineIcon;
    }
    get text(): string {
        return 'hello';
    }

    public constructor(editor: IPaintEditor) {
        this.editor = editor;
    }

    componentDidMount(props: any) {
        if (props.isBitLineModeActive) {
            this.activateTool(props);
        }
    }
    componentWillReceiveProps(props, nextProps) {
        if (this.tool && nextProps.color !== props.color) {
            this.tool.setColor(nextProps.color);
        }
        if (this.tool && nextProps.bitBrushSize !== props.bitBrushSize) {
            this.tool.setLineSize(nextProps.bitBrushSize);
        }

        if (nextProps.isBitLineModeActive && !props.isBitLineModeActive) {
            this.activateTool(props);
        } else if (!nextProps.isBitLineModeActive && props.isBitLineModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate(props, nextProps) {
        return nextProps.isBitLineModeActive !== props.isBitLineModeActive;
    }
    componentWillUnmount() {
        if (this.tool) {
            this.deactivateTool();
        }
    }
    activateTool(props) {
        clearSelection(props.clearSelectedItems);
        //props.clearGradient();
        // Force the default line color if fill is MIXED or transparent
        let color = props.color;
        if (!color || color === MIXED) {
            //props.onChangeFillColor(DEFAULT_COLOR);
            color = DEFAULT_COLOR;
        }
        this.tool = new BitLineTool(
            this.editor.handleUpdateImage
        );
        this.tool.setColor(color);
        this.tool.setLineSize(props.bitBrushSize);

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
        this.editor.setState({ mode: Modes.BIT_LINE });
    }
}

