import React from 'react';
import classNames from 'classnames';

import Button from './button';
import './ToolSelectButton.css';
import _ from 'lodash';

export interface IToolSelectButtonProps {
    disabled: boolean;
    isSelected: boolean;
    command: IToolSelectCommand;
}

export interface IToolSelectButtonState {

}

export interface IToolSelectCommand {
    componentDidMount(props: any);
    componentWillReceiveProps(props: any, nextProps: any);
    shouldComponentUpdate(props: any, nextProps: any);
    componentWillUnmount(props: any);

    onCommand();

    get imgSrc(): string;
    get text(): string;
}

export default class ToolSelectButton extends React.Component<IToolSelectButtonProps, IToolSelectButtonState> {
    public constructor(props) {
        super(props);
        _.bindAll(this, [
            'onClick'
        ]);
    }
    componentDidMount() {
        this.props.command.componentDidMount(this.props);
    }
    componentWillReceiveProps(nextProps: any) {
        this.props.command.componentWillReceiveProps(this.props, nextProps);
    }
    shouldComponentUpdate(nextProps) {
        return this.props.command.shouldComponentUpdate(this.props, nextProps);
    }
    componentWillUnmount() {
        return this.props.command.componentWillUnmount(this.props);
    }

    private onClick() {
        this.props.command.onCommand();
    }

    render() {
        return (
            <Button
                className={
                    'mod-tool-select'
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
                    className={'img.tool-select-icon'}
                    draggable={false}
                    src={this.props.command.imgSrc}
                />
            </Button>
        );
    }
}
