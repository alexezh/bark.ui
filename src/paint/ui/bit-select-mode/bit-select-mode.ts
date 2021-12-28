import Modes from '../../lib/modes';

import BitSelectTool from '../../tools/bit-tools/select-tool';
import { IPaperEditor } from '../../PaperEditor';
import { ToolSelectCommand } from '../ToolSelectCommand';

import selectIcon from './marquee.svg';

export const BitSelectModeCommand_commandId: string = 'bit-select-mode';

export default class BitSelectModeCommand extends ToolSelectCommand<BitSelectTool> {
    public constructor(editor: IPaperEditor) {
        super(editor, BitSelectModeCommand_commandId, Modes.BIT_SELECT, selectIcon, 'select');
    }

    updateState(): boolean {
        let isDirty = false;
        //if (this.tool && this.selectedItems !== this.editor.selectedItems) {
        //    this.tool.onSelectionChanged(nextProps.selectedItems);
        //}
        return isDirty;
    }

    activateTool() {
        // this.props.clearGradient();
        this.tool = new BitSelectTool(
            this.editor.handleSetSelectedItems,
            this.editor.handleClearSelectedItems,
            this.editor.handleSetCursor,
            this.editor.handleUpdateImage
        );
        this.tool.activate();
    }
}
