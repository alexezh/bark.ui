import { MIXED } from '../../tools/style-path';
import { clearSelection, getSelectedLeafItems } from '../../tools/selection';
import BitBrushTool from '../../tools/bit-tools/brush-tool';
import { IToolSelectCommand, ToolSelectCommand } from '../ToolSelectCommand';
import { DEFAULT_COLOR } from '../../tools/colors';
import Modes, { BitmapModes } from '../../lib/modes';
import { Color, IPaperEditor } from '../../PaperEditor';

import brushIcon from './brush.svg';

/*
onst BitLineComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.line}
        imgSrc={lineIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

BitLineComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};
 */

export const BitBrushModeCommand_commandId: string = 'bit-brush-mode';

export default class BitBrushModeCommand extends ToolSelectCommand<BitBrushTool> {
    private bitBrushSize: any;
    private color: Color;

    public constructor(editor: IPaperEditor) {
        super(editor, BitBrushModeCommand_commandId, Modes.BIT_BRUSH, brushIcon, 'hello');
        this.bitBrushSize = editor.state.bitBrushSize;
        this.color = editor.state.color;
    }

    updateState(): boolean {
        let isDirty = false;
        if (this.tool) {
            if (this.color !== this.editor.state.color) {
                this.color = this.editor.state.color;
                this.tool.setColor(this.editor.state.color);
                isDirty = true;
            }
            if (this.bitBrushSize !== this.editor.state.bitBrushSize) {
                this.bitBrushSize = this.editor.state.bitBrushSize;
                this.tool.setBrushSize(this.editor.state.bitBrushSize);
                isDirty = true;
            }
        }
        return isDirty;
    }

    activateTool() {
        //clearSelection(props.clearSelectedItems);
        // this.clearGradient();
        // Force the default brush color if fill is MIXED or transparent
        let color = this.editor.state.color;
        if (!color || color.primary === MIXED) {
            // this.props.onChangeFillColor(DEFAULT_COLOR);
            color.primary = DEFAULT_COLOR;
        }

        // @ts-ignore
        this.tool = new BitBrushTool(
            this.editor.handleUpdateImage
        );
        this.tool.setColor(color);
        this.tool.setBrushSize(this.editor.state.bitBrushSize);

        this.tool.activate();
    }
}

