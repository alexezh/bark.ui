import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

import Button from '../button/button.jsx';

import './tool-select-base.css';

export class ImgDescriptor {
    public defaultMessage: string;
    public description: string;
    public id: string;
}

export interface IToolSelectComponentProps {
    className: string;
    disabled: boolean;
    imgDescriptor: ImgDescriptor;
    imgSrc: string;
    isSelected: boolean;
    onMouseDown: any;
    controller: IToolSelectController;
}

export interface IToolSelectComponentState {

}

export interface IToolSelectController {
    componentDidMount();
    componentWillReceiveProps(nextProps: any);
    shouldComponentUpdate(nextProps: any);
    componentWillUnmount();
}

export class ToolSelectComponent extends React.Component<IToolSelectComponentProps, IToolSelectComponentState> {
    componentDidMount() {
        this.props.controller.componentDidMount();
    }
    componentWillReceiveProps(nextProps) {
        this.props.controller.componentWillReceiveProps(nextProps);
    }
    shouldComponentUpdate(nextProps) {
        return this.props.controller.shouldComponentUpdate(nextProps);
    }
    componentWillUnmount() {
        return this.props.controller.componentWillUnmount();
    }

    render() {
        return (
            <Button
                className={
                    classNames(props.className, styles.modToolSelect, {
                        [styles.isSelected]: props.isSelected
                    })
                }
                disabled={props.disabled}
                title={props.intl.formatMessage(props.imgDescriptor)}
                onClick={props.onMouseDown}
            >
                <img
                    alt={props.intl.formatMessage(props.imgDescriptor)}
                    className={styles.toolSelectIcon}
                    draggable={false}
                    src={props.imgSrc}
                />
            </Button>
        );
    }
}
