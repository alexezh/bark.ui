// @flow

// Thanks to https://gist.github.com/DelvarWorld/3784055
// for the inspiration for the shift-selection

import * as React from 'react'
import cx from 'classnames'
import includes from 'lodash/includes'
import { KEYS, KEY } from './keys'
import ListItem from './list-item'
import './list.css'
import _ from 'lodash'

export interface IListProps {
	className?: string;
	itemCount: number;
	render: (idx: number) => { item: React.ReactNode, key: string } | undefined;
	selectedItem: null | number;
	onChange: (event: null | number) => void;
	keyboardEvents: boolean;
}

export interface IListState {
	itemCount: number;
	render: (idx: number) => { item: React.ReactNode, key: string } | undefined;
	selectedItem: null | number;
	focusedIndex: null | number;
	lastSelected: null | number;
}

export default class List extends React.Component<IListProps, IListState> {
	static defaultProps = {
		itemCount: 0,
		render: () => undefined,
		selectedItem: null,
		multiple: false,
		onChange: () => { },
		keyboardEvents: true,
	}

	public constructor(props: any) {
		super(props);
		_.bindAll(this, [
			'focusIndex',
			'toggleMouseSelect'
		]);

		this.state = {
			itemCount: this.props.itemCount,
			render: this.props.render,
			selectedItem: this.props.selectedItem,
			focusedIndex: null,
			lastSelected: null,
		}
	}

	componentWillReceiveProps(nextProps: IListProps) {
		this.setState(() => ({
			itemCount: nextProps.itemCount,
			render: nextProps.render,
			selectedItem: nextProps.selectedItem,
		}))
	}

	clear() {
		this.setState(() => ({
			selectedItem: null,
			focusedIndex: null,
			lastSelected: null,
		}))
	}

	select(index: null | number) {
		if (index === null) {
			return
		}

		this.setState(
			state => {
				return { selectedItem: index, lastSelected: index }
			},
			() => {
				this.props.onChange(this.state.lastSelected)
			},
		)
	}

	deselect(index: null | number) {
		if (index === null) {
			return
		}

		this.setState(
			state => {
				return { selectedItem: null, lastSelected: index }
			},
			() => {
				this.props.onChange(null)
			},
		)
	}

	focusIndex(index: null | number = null) {
		// @ts-ignore
		this.setState(state => {
			if (index === null) {
				return {}
			}

			let { focusedIndex } = state

			focusedIndex = index

			return { focusedIndex }
		})
	}

	focusPrevious() {
		this.setState(state => {
			let { focusedIndex } = state
			let lastItem = state.itemCount - 1

			if (focusedIndex === null) {
				focusedIndex = lastItem
			} else {
				// focus last item if reached the top of the list
				focusedIndex = focusedIndex <= 0 ? lastItem : focusedIndex - 1
			}

			return { focusedIndex }
		})
	}

	focusNext() {
		this.setState(state => {
			let { focusedIndex } = state
			let lastItem = state.itemCount - 1

			if (focusedIndex === null) {
				focusedIndex = 0
			} else {
				// focus first item if reached last item in the list
				focusedIndex = focusedIndex >= lastItem ? 0 : focusedIndex + 1
			}

			return { focusedIndex }
		})
	}

	onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
		let key = event.keyCode

		if (key === KEY.UP || key === KEY.K) {
			this.focusPrevious()
		} else if (key === KEY.DOWN || key === KEY.J) {
			this.focusNext()
		} else if (key === KEY.SPACE || key === KEY.ENTER) {
			this.toggleKeyboardSelect({
				event,
				index: this.state.focusedIndex,
			})
		}

		// prevent default behavior where in some situations pressing the
		// key up / down would scroll the browser window
		if (includes(KEYS, key)) {
			event.preventDefault()
		}
	}

	toggleSelect = (args: { contiguous: boolean, index: null | number }) => {
		let { contiguous, index } = args
		if (index === null) {
			return
		}

		this.select(index)
	}

	toggleKeyboardSelect(args: {
		event: React.KeyboardEvent<HTMLElement>,
		index: null | number,
	}) {
		let { event, index } = args
		event.preventDefault()
		let shift = event.shiftKey
		this.toggleSelect({ contiguous: shift, index })
	}

	toggleMouseSelect(event: React.MouseEvent<HTMLElement>, index: number) {
		event.preventDefault()
		let shift = event.shiftKey
		this.toggleSelect({ contiguous: shift, index })
	}

	public render() {
		let items: any[] = [];
		for (let index = 0; index < this.state.itemCount; index++) {
			let item = this.state.render(index);
			if (item == undefined) {
				break;
			}
			let selected = this.state.selectedItem == index;
			let focused = this.state.focusedIndex === index;
			items.push((
				<ListItem
					key={item.key}
					index={index}
					selected={selected}
					focused={focused}
					onMouseOver={this.focusIndex}
					onChange={this.toggleMouseSelect}
				>
					{item.item}
				</ListItem>
			));
		}

		return (
			<ul
				className={
					cx('react-list-select', this.props.className)
				}
				tabIndex={0}
				onKeyDown={this.props.keyboardEvents ? this.onKeyDown : undefined}
			>
				{items}
			</ul>
		)
	}
}
