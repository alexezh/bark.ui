import React from 'react';
import PropTypes from 'prop-types';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';
import messages from '../../lib/messages.js';
import selectIcon from './marquee.svg';

const BitSelectComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.select}
        imgSrc={selectIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

BitSelectComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default BitSelectComponent;

import paper from '@scratch/paper';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes';

import { clearFillGradient } from '../reducers/fill-style';
import { changeMode } from '../reducers/modes';
import { clearSelectedItems, setSelectedItems } from '../reducers/selected-items';
import { setCursor } from '../reducers/cursor';

import { getSelectedLeafItems } from '../helper/selection';
import BitSelectTool from '../helper/bit-tools/select-tool';
import SelectModeComponent from '../components/bit-select-mode/bit-select-mode.jsx';

class BitSelectMode extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
    }
    componentDidMount() {
        if (this.props.isSelectModeActive) {
            this.activateTool(this.props);
        }
    }
    componentWillReceiveProps(nextProps) {
    }
}


import { MIXED } from '../../tools/style-path';
import { clearSelection, getSelectedLeafItems } from '../../tools/selection';
import BitBrushTool from '../../tools/bit-tools/brush-tool';
import { IToolSelectCommand, ToolSelectCommand } from '../ToolSelectCommand';
import { DEFAULT_COLOR } from '../../tools/colors';
import Modes, { BitmapModes } from '../../lib/modes';
import { IPaintEditor } from '../PaintEditor';

import brushIcon from './brush.svg';


export const BitSelectModeCommand_commandId: string = 'bit-select-mode';

export default class BitSelectModeCommand extends ToolSelectCommand<BitSelectTool> {
    public constructor(editor: IPaintEditor) {
        super(editor, BitBrushModeCommand_commandId, Modes.BIT_SELECT, brushIcon, 'hello');
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
            this.editor.onUpdateImage
        );
        this.tool.activate();
    }
}



