import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import Button from './button';
import { IPaperEditor } from '../PaperEditor';
import { IToolSelectCommand } from './ToolSelectCommand'

import './ToolSelectButton.css';
import { EditorMode } from '../../GameEditorCanvas';

export interface IToolSelectButtonProps {
    className: string;
    command: IToolSelectCommand;
}

export interface IToolSelectButtonState {
    isSelected: boolean;
}

export default class ToolSelectButton extends React.Component<IToolSelectButtonProps, IToolSelectButtonState> {
    public constructor(props) {
        super(props);
        _.bindAll(this, [
            'componentDidMount',
            'componentWillUnmount',
            'onClick'
        ]);

        this.state = {
            isSelected: this.props.command.isSelected,
        }
    }
    componentDidMount() {
        this.props.command.componentDidMount(this);
    }
    UNSAFE_componentWillReceiveProps(newProps) {
        return this.state.isSelected !== newProps.command.isSelected;
    }
    componentWillUnmount() {
        return this.props.command.componentWillUnmount();
    }

    private onClick() {
        this.props.command.onCommand();
        this.setState({ isSelected: this.props.command.isSelected })
    }

    render() {
        return (
            <Button
                className={
                    classNames('mod-tool-select',
                        {
                            ['is-selected']: this.state.isSelected
                        })
                }
                disabled={false}
                title={this.props.command.text}
                highlighted={false}
                onClick={this.onClick}
            >
                <img
                    className={'tool-image-icon'}
                    draggable={false}
                    src={this.props.command.imgSrc}
                />
            </Button>
        );
    }
}
