import { clearSelection, getSelectedLeafItems } from '../../tools/selection';
import RectTool from '../../tools/vector-tools/rect-tool';

import Modes from '../../lib/modes';

import { IToolSelectCommand, ToolSelectCommand } from '../ToolSelectCommand';
import { IPaintEditor } from '../PaintEditor';

import rectIcon from './rectangle.svg';

export const RectModeCommand_commandId: string = 'rect-mode';

export default class RectModeCommand extends ToolSelectCommand<RectTool> {
    private selectedItems: [];
    private zoom: number;

    public constructor(editor: IPaintEditor) {
        super(editor, RectModeCommand_commandId, Modes.RECT, rectIcon, 'hello');

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
        // this.validateColorState();

        this.tool = new RectTool(
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
