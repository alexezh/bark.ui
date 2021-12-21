import React from 'react';
import classNames from 'classnames';

import Button from './button';
import './ToolSelectButton.css';

export interface IToolSelectButtonProps {
    disabled: boolean;
    isSelected: boolean;
    controller: IToolSelectCommand;
}

export interface IToolSelectButtonState {

}

export interface IToolSelectCommand {
    componentDidMount(props: any);
    componentWillReceiveProps(props: any, nextProps: any);
    shouldComponentUpdate(props: any, nextProps: any);
    componentWillUnmount(props: any);

    get imgSrc(): string;
    get text(): string;
}

export default class ToolSelectButton extends React.Component<IToolSelectButtonProps, IToolSelectButtonState> {
    public constructor(props) {
        super(props);
        this.onClick.bind(this);
    }
    componentDidMount() {
        this.props.controller.componentDidMount(this.props);
    }
    componentWillReceiveProps(nextProps: any) {
        this.props.controller.componentWillReceiveProps(this.props, nextProps);
    }
    shouldComponentUpdate(nextProps) {
        return this.props.controller.shouldComponentUpdate(this.props, nextProps);
    }
    componentWillUnmount() {
        return this.props.controller.componentWillUnmount(this.props);
    }

    private onClick() {

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
                title={this.props.controller.text}
                highlighted={false}
                onClick={this.onClick}
            >
                <img
                    className={'img.tool-select-icon'}
                    draggable={false}
                    src={this.props.controller.imgSrc}
                />
            </Button>
        );
    }
}
