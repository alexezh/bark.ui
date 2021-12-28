import { MIXED } from '../../tools/style-path';
import { clearSelection, getSelectedLeafItems } from '../../tools/selection';
import BitLineTool from '../../tools/bit-tools/line-tool';
import { IToolSelectCommand, ToolSelectCommand } from '../ToolSelectCommand';
import { DEFAULT_COLOR } from '../../tools/colors';
import Modes, { BitmapModes } from '../../lib/modes';
import { IPaperEditor } from '../../PaperEditor';
import OvalTool from '../../tools/bit-tools/oval-tool';

import BitOvalTool from '../../tools/bit-tools/oval-tool';
import ovalIcon from './oval.svg';


export const BitOvalModeCommand_commandId: string = 'bit-oval-mode';

export default class BitOvalModeCommand extends ToolSelectCommand<BitOvalTool> {
    private selectedItems: [];
    private zoom: number;

    public constructor(editor: IPaperEditor) {
        super(editor, BitOvalModeCommand_commandId, Modes.BIT_OVAL, ovalIcon, 'oval');

        this.selectedItems = this.editor.state.selectedItems;
        this.zoom = 1.0;
    }

    updateState(): boolean {
        let isDirty = false;
        if (this.tool) {
            if (this.editor.state.color !== this.tool.color) {
                this.tool.setColor(this.editor.state.color);
                isDirty = true;
            }
            //if (this.editor.selectedItems !== this.selectedItems) {
            //    this.selectedItems = this.editor.selectedItems;
            //    this.tool.onSelectionChanged(this.editor.selectedItems);
            //}
            if (this.editor.state.filled !== this.tool.filled) {
                this.tool.setFilled(this.editor.state.filled);
            }
            if (this.editor.state.thickness !== this.tool.thickness ||
                this.editor.state.zoom !== this.zoom) {
                this.tool.setThickness(this.editor.state.thickness);
            }
        }
        return isDirty;
    }
    activateTool() {
        clearSelection(this.editor.handleClearSelectedItems);
        // Force the default brush color if fill is MIXED or transparent
        const fillColorPresent = this.editor.state.color.primary !== MIXED && this.editor.state.color.primary !== null;
        if (!fillColorPresent) {
            //this.props.onChangeFillColor(DEFAULT_COLOR);
        }

        this.tool = new OvalTool(
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
