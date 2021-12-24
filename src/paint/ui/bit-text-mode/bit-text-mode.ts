
import Modes from '../../lib/modes';

import { clearSelection, getSelectedLeafItems } from '../../tools/selection';
import RectTool from '../../tools/bit-tools/rect-tool';

import { IPaintEditor } from '../../PaintEditor';
import { ToolSelectCommand } from '../ToolSelectCommand';

import textIcon from './text.svg';

export const BitTextModeCommand_commandId: string = 'bit-text-mode';

export default class BitTextModeCommand extends ToolSelectCommand<RectTool> {
    private zoom: number;
    public constructor(editor: IPaintEditor) {
        super(editor, BitTextModeCommand_commandId, Modes.BIT_RECT, textIcon, 'hello');
        this.zoom = this.editor.state.zoom;
    }

    updateState(): boolean {
        let isDirty = false;
        if (this.tool) {
            if (this.tool.color !== this.editor.state.color) {
                this.tool.setColor(this.editor.state.color);
            }
            //if (nextProps.selectedItems !== this.props.selectedItems) {
            //    this.tool.onSelectionChanged(nextProps.selectedItems);
            //}
            if (this.tool.filled !== this.editor.state.filled) {
                this.tool.setFilled(this.editor.state.filled);
            }
            if (this.tool.thickness !== this.editor.state.thickness ||
                this.zoom !== this.editor.state.zoom) {
                this.tool.setThickness(this.editor.state.thickness);
            }
        }
        return isDirty;
    }

    activateTool() {
        // clearSelection();
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
        this.tool.setColor(this.editor.state.color);
        this.tool.setFilled(this.editor.state.filled);
        this.tool.setThickness(this.editor.state.thickness);
        this.tool.activate();
    }
}



