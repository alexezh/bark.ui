/* DO NOT EDIT
@todo This file is copied from GUI and should be pulled out into a shared library.
See #13 */

/* ACTUALLY, THIS IS EDITED ;)
THIS WAS CHANGED ON 10/25/2017 BY @mewtaylor TO ADD HANDLING FOR DISABLED STATES.*/

import classNames from 'classnames';
import React, { FC } from 'react';

import './button.css';

export interface IButtonProps {
    children: any,
    className: string,
    disabled: string | boolean;
    highlighted: boolean;
    title: string;
    onClick: any
};

const ButtonComponent: FC<IButtonProps> = ({
    className,
    highlighted,
    onClick,
    children,
    ...props
}) => {
    const disabled = props.disabled || false;
    if (disabled === false) {
        // if not disabled, add `onClick()` to be applied
        // in props. If disabled, don't add `onClick()`
        // props.onClick = onClick;
    }
    return (
        <span
            className={classNames(
                'button',
                className,
                //                {
                //                    [styles.modDisabled]: disabled,
                //                    [styles.highlighted]: highlighted
                //                }
            )}
            role="button"
            {...props}
        >
            {children}
        </span>
    );
};

export default ButtonComponent;