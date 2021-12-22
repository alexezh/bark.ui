import { MIXED } from '../../tools/style-path';
import { clearSelection, getSelectedLeafItems } from '../../tools/selection';
import BitLineTool from '../../tools/bit-tools/line-tool';
import { IToolSelectCommand, ToolSelectCommand } from '../ToolSelectCommand';
import { DEFAULT_COLOR } from '../../tools/colors';
import Modes, { BitmapModes } from '../../lib/modes';
import { IPaintEditor } from '../PaintEditor';
import OvalTool from '../../tools/bit-tools/oval-tool';

import BitOvalTool from '../../tools/bit-tools/oval-tool';
import ovalIcon from './oval.svg';


export const BitOvalModeCommand_commandId: string = 'bit-oval-mode';

export default class BitOvalModeCommand extends ToolSelectCommand<BitOvalTool> {
    private selectedItems: [];
    private zoom: number;

    public constructor(editor: IPaintEditor) {
        super(editor, BitOvalModeCommand_commandId, Modes.BIT_OVAL, ovalIcon, 'hello');

        this.selectedItems = this.editor.selectedItems;
        this.zoom = 1.0;
    }

    updateState(): boolean {
        let isDirty = false;
        if (this.tool) {
            if (this.editor.color !== this.tool.color) {
                this.tool.setColor(this.editor.color);
                isDirty = true;
            }
            //if (this.editor.selectedItems !== this.selectedItems) {
            //    this.selectedItems = this.editor.selectedItems;
            //    this.tool.onSelectionChanged(this.editor.selectedItems);
            //}
            if (this.editor.filled !== this.tool.filled) {
                this.tool.setFilled(this.editor.filled);
            }
            if (this.editor.thickness !== this.tool.thickness ||
                this.editor.zoom !== this.zoom) {
                this.tool.setThickness(this.editor.thickness);
            }
        }
        return isDirty;
    }
    activateTool() {
        clearSelection(this.editor.handleClearSelectedItems);
        // Force the default brush color if fill is MIXED or transparent
        const fillColorPresent = this.editor.color.primary !== MIXED && this.editor.color.primary !== null;
        if (!fillColorPresent) {
            //this.props.onChangeFillColor(DEFAULT_COLOR);
        }

        this.tool = new OvalTool(
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
