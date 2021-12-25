
import paper from 'paper';
import Modes from '../../lib/modes';
import Blobbiness from '../../tools/blob-tools/blob';

import { clearSelection } from '../../tools/selection';

import { IToolSelectCommand, ToolSelectCommand } from '../ToolSelectCommand';
import { IPaperEditor } from '../../PaperEditor';

import brushIcon from './brush.svg';

export const BrushModeCommand_commandId: string = 'brush-mode';

export default class BrushModeCommand extends ToolSelectCommand<paper.Tool> {
    private selectedItems: [];
    private zoom: number;
    private blob: Blobbiness;

    public constructor(editor: IPaperEditor) {
        super(editor, BrushModeCommand_commandId, Modes.BRUSH, brushIcon, 'hello');

        this.selectedItems = this.editor.state.selectedItems;
        this.zoom = 1.0;
        this.blob = new Blobbiness(
            this.editor.handleUpdateImage, this.editor.handleClearSelectedItems);
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
        /*
                if (nextProps.isBrushModeActive && !this.props.isBrushModeActive) {
                    this.activateTool();
                } else if (!nextProps.isBrushModeActive && this.props.isBrushModeActive) {
                    this.deactivateTool();
                } else if (nextProps.isBrushModeActive && this.props.isBrushModeActive) {
                    const { fillColor, strokeColor, strokeWidth } = this.editor.colorState;
                    this.blob.setOptions({
                        isEraser: false,
                        fillColor: fillColor.primary,
                        strokeColor: strokeColor.primary,
                        strokeWidth,
                        ...nextProps.brushModeState
                    });
                }
        */
        return isDirty;
    }
    activateTool() {
        // TODO: Instead of clearing selection, consider a kind of "draw inside"
        // analogous to how selection works with eraser
        clearSelection(this.editor.handleClearSelectedItems);
        //this.props.clearGradient();
        // Force the default brush color if fill is MIXED or transparent
        //const fillColor = this.props.colorState.fillColor.primary;
        //if (fillColor === MIXED || fillColor === null) {
        //    this.props.onChangeFillColor(DEFAULT_COLOR);
        //}
        this.blob.activateTool({
            isEraser: false,
            ...this.editor.state.colorState,
            ...this.editor.state.brushMode
        });
    }

    deactivateTool(): void {
        this.blob.deactivateTool();
    }
}
