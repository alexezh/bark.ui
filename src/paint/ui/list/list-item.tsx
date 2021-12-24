// @flow

import * as React from 'react'
import cx from 'classnames'

export interface IListItemProps {
	selected: boolean;
	focused: boolean;
	onMouseOver: (number) => any;
	children: React.ReactNode;
	index: number;
	onChange: (event: React.MouseEvent<HTMLElement>, index: number) => any;
}

export default class ListItem extends React.Component<IListItemProps> {
	static defaultProps = {
		selected: false,
		focused: false,
	}

	handleMouseOver() {
		this.props.onMouseOver(this.props.index)
	}

	handleChange(ev: React.MouseEvent<HTMLElement>) {
		this.props.onChange(ev, this.props.index)
	}

	render() {
		let props = this.props
		let classes = cx('react-list-select--item', {
			'is-selected': props.selected,
			'is-focused': props.focused,
		})

		return (
			<li
				className={classes}
				onMouseOver={this.handleMouseOver}
				onClick={this.handleChange}
			>
				{props.children}
			</li>
		)
	}
}
