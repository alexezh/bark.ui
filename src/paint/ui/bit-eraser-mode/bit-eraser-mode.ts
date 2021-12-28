
import { MIXED } from '../../tools/style-path';
import { clearSelection, getSelectedLeafItems } from '../../tools/selection';
import BitBrushTool from '../../tools/bit-tools/brush-tool';
import { IToolSelectCommand, ToolSelectCommand } from '../ToolSelectCommand';
import { DEFAULT_COLOR } from '../../tools/colors';
import Modes, { BitmapModes } from '../../lib/modes';
import { IPaperEditor } from '../../PaperEditor';

import eraserIcon from './eraser.svg';
import { throws } from 'assert';


export const BitEraserModeCommand_commandId: string = 'bit-eraser-mode';

export default class BitEraserModeCommand extends ToolSelectCommand<BitBrushTool> {
    private bitEraserSize: number;

    public constructor(editor: IPaperEditor) {
        super(editor, BitEraserModeCommand_commandId, Modes.BIT_ERASER, eraserIcon, 'eraser');

        this.bitEraserSize = editor.state.bitEraserSize;
    }

    updateState(): boolean {
        let isDirty: boolean = false;
        if (this.tool && this.editor.state.bitEraserSize !== this.bitEraserSize) {
            this.tool.setBrushSize(this.editor.state.bitEraserSize);
            isDirty = true;
        }

        return isDirty;
    }
    activateTool() {
        // clearSelection(props.clearSelectedItems);
        //props.clearGradient();
        // Force the default line color if fill is MIXED or transparent
        this.tool = new BitBrushTool(
            this.editor.handleUpdateImage,
            true /* isEraser */
        );
        this.tool.setBrushSize(this.bitEraserSize);

        this.tool.activate();
    }
}

