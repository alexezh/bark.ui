import Modes from '../../lib/modes';
import GradientTypes from '../../lib/gradient-types';
import FillTool from '../../tools/vector-tools/fill-tool';
import { generateSecondaryColor, MIXED } from '../../tools/style-path';

import { clearSelection, getSelectedLeafItems } from '../../tools/selection';

import { IToolSelectCommand, ToolSelectCommand } from '../ToolSelectCommand';
import { IPaintEditor } from '../../PaintEditor';

import fillIcon from './fill.svg';


export const FillModeCommand_commandId: string = 'fill-mode';

export default class FillModeCommand extends ToolSelectCommand<FillTool> {
    private selectedItems: [];
    private zoom: number;

    public constructor(editor: IPaintEditor) {
        super(editor, FillModeCommand_commandId, Modes.FILL, fillIcon, 'hello');

        this.selectedItems = this.editor.selectedItems;
        this.zoom = 1.0;
    }

    updateState(): boolean {
        let isDirty = false;
        if (this.tool) {
            /*
            if (nextProps.fillColor !== this.props.fillColor) {
                this.tool.setFillColor(nextProps.fillColor);
            }
            if (nextProps.fillColor2 !== this.props.fillColor2) {
                this.tool.setFillColor2(nextProps.fillColor2);
            }
            if (nextProps.hoveredItemId !== this.props.hoveredItemId) {
                this.tool.setPrevHoveredItemId(nextProps.hoveredItemId);
            }
            if (nextProps.fillModeGradientType !== this.props.fillModeGradientType) {
                this.tool.setGradientType(nextProps.fillModeGradientType);
            }
            */
        }
        return isDirty;
    }
    activateTool() {
        clearSelection(this.editor.handleClearSelectedItems);

        /*
        // Force the default fill color if fill is MIXED
        let fillColor = this.props.fillColor;
        if (this.props.fillColor === MIXED) {
            fillColor = DEFAULT_COLOR;
            this.props.onChangeFillColor(DEFAULT_COLOR, 0);
        }
        const gradientType = this.props.fillModeGradientType ?
            this.props.fillModeGradientType : this.props.fillStyleGradientType;
        let fillColor2 = this.props.fillColor2;
        if (gradientType !== this.props.fillStyleGradientType) {
            if (this.props.fillStyleGradientType === GradientTypes.SOLID) {
                fillColor2 = generateSecondaryColor(fillColor);
                this.props.onChangeFillColor(fillColor2, 1);
            }
            //this.props.changeGradientType(gradientType);
        }
        if (this.editor.colorState.fillColor2 === MIXED) {
            fillColor2 = generateSecondaryColor(fillColor);
            //this.props.onChangeFillColor(fillColor2, 1);
        }
        this.tool = new FillTool(
            this.editor.setHoveredItem,
            this.props.clearHoveredItem,
            this.props.onUpdateImage
        );
        this.tool.setFillColor(fillColor);
        this.tool.setFillColor2(fillColor2);
        this.tool.setGradientType(gradientType);
        this.tool.setPrevHoveredItemId(this.props.hoveredItemId);
        this.tool.activate();
        */
    }
}
