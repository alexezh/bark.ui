import { MIXED } from '../tools/style-path';
import { clearSelection, getSelectedLeafItems } from '../tools/selection';
import BitLineTool from '../tools/bit-tools/line-tool';
import { IToolSelectCommand, ToolSelectCommand } from './ToolSelectCommand';
import { DEFAULT_COLOR } from '../tools/colors';
import Modes, { BitmapModes } from '../lib/modes';
import { IPaintEditor } from './PaintEditor';

import lineIcon from './line.svg';


export const BitLineModeCommand_commandId: string = 'bit-line-mode';

export default class BitLineModeCommand extends ToolSelectCommand<BitLineTool> {
    public constructor(editor: IPaintEditor) {
        super(editor, BitLineModeCommand_commandId, Modes.BIT_LINE, lineIcon, 'hello');
    }

    updateState(): boolean {
        let isDirty: boolean = false;
        if (this.tool) {
            if (this.tool.color !== this.editor.color) {
                this.tool.setColor(this.editor.color);
                isDirty = true;
            }
            if (this.tool.size !== this.editor.bitBrushSize) {
                this.tool.setLineSize(this.editor.bitBrushSize);
                isDirty = true;
            }
        }

        return isDirty;
    }
    activateTool() {
        // clearSelection(props.clearSelectedItems);
        //props.clearGradient();
        // Force the default line color if fill is MIXED or transparent
        let color = this.editor.color;
        if (!color || color.primary === MIXED) {
            //props.onChangeFillColor(DEFAULT_COLOR);
            color.primary = DEFAULT_COLOR;
        }
        this.tool = new BitLineTool(
            this.editor.handleUpdateImage
        );
        this.tool.setColor(color);
        this.tool.setLineSize(this.editor.bitBrushSize);

        this.tool.activate();
    }
}

