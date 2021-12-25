import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import Button from './button';
import { IPaperEditor } from '../PaperEditor';
import { IToolSelectCommand } from './ToolSelectCommand'

import './ToolSelectButton.css';

export interface IToolSelectButtonProps {
    className: string;
    disabled: boolean;
    isSelected: boolean;
    command: IToolSelectCommand;
}

export interface IToolSelectButtonState {
    version: number;
}

export default class ToolSelectButton extends React.Component<IToolSelectButtonProps, IToolSelectButtonState> {
    public constructor(props) {
        super(props);
        _.bindAll(this, [
            'componentDidMount',
            'componentWillUnmount',
            'shouldComponentUpdate',
            'onClick'
        ]);

        this.state = {
            version: 1.0,
        }
    }
    componentDidMount() {
        this.props.command.componentDidMount(this);
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.state.version !== nextState.version;
    }
    componentWillUnmount() {
        return this.props.command.componentWillUnmount();
    }

    private onClick() {
        this.props.command.onCommand();
    }

    render() {
        return (
            <Button
                className={
                    classNames('mod-tool-select')
                    //                    classNames(this.props.className, styles.modToolSelect, {
                    //                        [styles.isSelected]: props.isSelected
                    //                    })
                }
                disabled={this.props.disabled}
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
