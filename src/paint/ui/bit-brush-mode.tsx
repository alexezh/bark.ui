import React from 'react';
import { MIXED } from '../tools/style-path';
import { clearSelection } from '../tools/selection';
import BitBrushTool from '../tools/bit-tools/brush-tool';
import { IToolSelectCommand } from './ToolSelectButton';
import { DEFAULT_COLOR } from '../tools/colors';
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

export default class BitBrushModeCommand implements IToolSelectCommand {
    private tool: BitBrushTool | null = null;

    get imgSrc(): string {
        return brushIcon;
    }
    get text(): string {
        return 'hello';
    }

    componentDidMount(props: any) {
        if (props.isBitBrushModeActive) {
            this.activateTool(props);
        }
    }
    componentWillReceiveProps(props: any, nextProps: any) {
        if (this.tool && nextProps.color !== props.color) {
            this.tool.setColor(nextProps.color);
        }
        if (this.tool && nextProps.bitBrushSize !== props.bitBrushSize) {
            this.tool.setBrushSize(nextProps.bitBrushSize);
        }

        if (nextProps.isBitBrushModeActive && !props.isBitBrushModeActive) {
            this.activateTool(props);
        } else if (!nextProps.isBitBrushModeActive && props.isBitBrushModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate(props, nextProps) {
        return nextProps.isBitBrushModeActive !== props.isBitBrushModeActive;
    }
    componentWillUnmount(props) {
        if (this.tool) {
            this.deactivateTool();
        }
    }
    activateTool(props: any) {
        clearSelection(props.clearSelectedItems);
        // this.clearGradient();
        // Force the default brush color if fill is MIXED or transparent
        let color = props.color;
        if (!color || color === MIXED) {
            // this.props.onChangeFillColor(DEFAULT_COLOR);
            color = DEFAULT_COLOR;
        }

        // @ts-ignore
        this.tool = new BitBrushTool(
            props.onUpdateImage
        );
        this.tool.setColor(color);
        this.tool.setBrushSize(props.bitBrushSize);

        this.tool.activate();
    }
    deactivateTool() {
        if (this.tool !== null) {
            this.tool.deactivateTool();
            this.tool.remove();
            this.tool = null;
        }
    }
}

