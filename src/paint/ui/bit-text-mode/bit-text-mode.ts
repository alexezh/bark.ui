
import Modes from '../../lib/modes';

import { clearSelection, getSelectedLeafItems } from '../../tools/selection';
import RectTool from '../../tools/bit-tools/rect-tool';

import { IPaintEditor } from '../PaintEditor';
import { ToolSelectCommand } from '../ToolSelectCommand';

import textIcon from './text.svg';

export const BitTextModeCommand_commandId: string = 'bit-text-mode';

export default class BitTextModeCommand extends ToolSelectCommand<RectTool> {
    private zoom: number;
    public constructor(editor: IPaintEditor) {
        super(editor, BitTextModeCommand_commandId, Modes.BIT_RECT, textIcon, 'hello');
        this.zoom = this.editor.zoom;
    }

    updateState(): boolean {
        let isDirty = false;
        if (this.tool) {
            if (this.tool.color !== this.editor.color) {
                this.tool.setColor(this.editor.color);
            }
            //if (nextProps.selectedItems !== this.props.selectedItems) {
            //    this.tool.onSelectionChanged(nextProps.selectedItems);
            //}
            if (this.tool.filled !== this.editor.filled) {
                this.tool.setFilled(this.editor.filled);
            }
            if (this.tool.thickness !== this.editor.thickness ||
                this.zoom !== this.editor.zoom) {
                this.tool.setThickness(this.editor.thickness);
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
        this.tool.setColor(this.editor.color);
        this.tool.setFilled(this.editor.filled);
        this.tool.setThickness(this.editor.thickness);
        this.tool.activate();
    }
}



