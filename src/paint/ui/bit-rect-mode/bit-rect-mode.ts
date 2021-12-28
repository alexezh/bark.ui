import { MIXED } from '../../tools/style-path';
import { clearSelection, getSelectedLeafItems } from '../../tools/selection';
import RectTool from '../../tools/bit-tools/rect-tool';
import { IToolSelectCommand, ToolSelectCommand } from '../ToolSelectCommand';
import { DEFAULT_COLOR } from '../../tools/colors';
import Modes, { BitmapModes } from '../../lib/modes';
import { Color, IPaperEditor } from '../../PaperEditor';

import rectIcon from './rectangle.svg';


export const BitRectModeCommand_commandId: string = 'bit-rect-mode';

export default class BitLineModeCommand extends ToolSelectCommand<RectTool> {
    private color: Color;
    private filled: boolean;
    private thickness: number;

    public constructor(editor: IPaperEditor) {
        super(editor, BitRectModeCommand_commandId, Modes.BIT_RECT, rectIcon, 'rectangle');

        this.color = editor.state.color;
        this.filled = editor.state.filled;
        this.thickness = editor.state.thickness;
    }

    updateState(): boolean {
        let isDirty: boolean = false;
        if (this.tool) {
            if (this.editor.state.color !== this.color) {
                this.color = this.editor.state.color;
                this.tool.setColor(this.color);
                isDirty = true;
            }
            //if (nextProps.selectedItems !== this.props.selectedItems) {
            //    this.tool.onSelectionChanged(nextProps.selectedItems);
            //}
            if (this.editor.state.filled !== this.filled) {
                this.tool.setFilled(this.filled);
                isDirty = true;
            }
            if (this.editor.state.thickness !== this.thickness) {
                // nextProps.zoom !== this.props.zoom) {
                this.thickness = this.editor.state.thickness;
                this.tool.setThickness(this.thickness);
                isDirty = true;
            }
        }

        return isDirty;
    }
    activateTool() {
        // clearSelection(props.clearSelectedItems);
        //props.clearGradient();
        // Force the default brush color if fill is MIXED or transparent
        //const fillColorPresent = this.props.color.primary !== MIXED && this.props.color.primary !== null;
        //if (!fillColorPresent) {
        //    this.props.onChangeFillColor(DEFAULT_COLOR);
        //}
        this.tool = new RectTool(
            this.editor.handleSetSelectedItems,
            this.editor.handleClearSelectedItems,
            this.editor.handleSetCursor,
            this.editor.handleUpdateImage
        );
        this.tool.setColor(this.color);
        this.tool.setFilled(this.filled);
        this.tool.setThickness(this.thickness);
        this.tool.activate();
    }
}



