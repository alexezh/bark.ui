import React from 'react';
import PropTypes from 'prop-types';
import messages from '../lib/messages.js';
import { MIXED } from '../tools/style-path';
import { clearSelection } from '../tools/selection';
import BitBrushTool from '../tools/bit-tools/brush-tool';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';

import brushIcon from './brush.svg';

class BitBrushModeController implements IToolSelectController {
    componentDidMount() {
        if (this.props.isBitBrushModeActive) {
            this.activateTool(this.props);
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.tool && nextProps.color !== this.props.color) {
            this.tool.setColor(nextProps.color);
        }
        if (this.tool && nextProps.bitBrushSize !== this.props.bitBrushSize) {
            this.tool.setBrushSize(nextProps.bitBrushSize);
        }

        if (nextProps.isBitBrushModeActive && !this.props.isBitBrushModeActive) {
            this.activateTool();
        } else if (!nextProps.isBitBrushModeActive && this.props.isBitBrushModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate(nextProps) {
        return nextProps.isBitBrushModeActive !== this.props.isBitBrushModeActive;
    }
    componentWillUnmount() {
        if (this.tool) {
            this.deactivateTool();
        }
    }
    activateTool() {
        clearSelection(this.props.clearSelectedItems);
        this.props.clearGradient();
        // Force the default brush color if fill is MIXED or transparent
        let color = this.props.color;
        if (!color || color === MIXED) {
            this.props.onChangeFillColor(DEFAULT_COLOR);
            color = DEFAULT_COLOR;
        }
        this.tool = new BitBrushTool(
            this.props.onUpdateImage
        );
        this.tool.setColor(color);
        this.tool.setBrushSize(this.props.bitBrushSize);

        this.tool.activate();
    }
    deactivateTool() {
        this.tool.deactivateTool();
        this.tool.remove();
        this.tool = null;
    }
    render() {
        return (
            <BitBrushModeComponent
                isSelected={this.props.isBitBrushModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

