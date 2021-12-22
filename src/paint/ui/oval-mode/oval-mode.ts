
import Modes from '../../lib/modes';
import { clearSelection, getSelectedLeafItems } from '../../tools/selection';
import OvalTool from '../../tools/vector-tools/oval-tool';

import { IToolSelectCommand, ToolSelectCommand } from '../ToolSelectCommand';
import { IPaintEditor } from '../PaintEditor';

import ovalIcon from './oval.svg';


export const OvalModeCommand_commandId: string = 'oval-mode';

export default class OvalModeCommand extends ToolSelectCommand<OvalTool> {
    private selectedItems: [];
    private zoom: number;

    public constructor(editor: IPaintEditor) {
        super(editor, OvalModeCommand_commandId, Modes.OVAL, ovalIcon, 'hello');

        this.selectedItems = this.editor.selectedItems;
        this.zoom = 1.0;
    }

    updateState(): boolean {
        let isDirty = false;
        if (this.tool) {
            //if (this.tool && nextProps.colorState !== this.props.colorState) {
            //    this.tool.setColorState(nextProps.colorState);
            //}
            //if (this.tool && nextProps.selectedItems !== this.props.selectedItems) {
            //    this.tool.onSelectionChanged(nextProps.selectedItems);
            //}
        }
        return isDirty;
    }
    activateTool() {
        clearSelection(this.editor.handleClearSelectedItems);

        this.tool = new OvalTool(
            this.editor.handleSetSelectedItems,
            this.editor.handleClearSelectedItems,
            this.editor.handleSetCursor,
            this.editor.handleUpdateImage
        );
        this.tool.setColorState(this.editor.colorState);
        // @ts-ignore
        this.tool.activate();
    }
}
