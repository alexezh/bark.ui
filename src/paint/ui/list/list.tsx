// @flow

// Thanks to https://gist.github.com/DelvarWorld/3784055
// for the inspiration for the shift-selection

import * as React from 'react'
import cx from 'classnames'
import includes from 'lodash/includes'
import range from 'lodash/range'
import reject from 'lodash/reject'
import uniq from 'lodash/uniq'
import { KEYS, KEY } from './keys'
import { ListItem } from './list-item'

export interface IListProps {
	className?: string;
	items: Array<React.ReactNode>;
	selected: number[];
	disabled: Array<number>;
	multiple: boolean;
	onChange: (event: null | number | Array<number>) => void;
	keyboardEvents: boolean;
}

export interface IListState {
	items: Array<React.ReactNode>;
	selectedItems: Array<number>;
	disabledItems: Array<number>;
	focusedIndex: null | number;
	lastSelected: null | number;
}

export class SelectArgs {
	index: null | number;
	contiguous: boolean;
}

export default class List extends React.Component<IListProps, IListState> {
	static defaultProps = {
		items: [],
		selected: [],
		disabled: [],
		multiple: false,
		onChange: () => { },
		keyboardEvents: true,
	}

	state = {
		items: this.props.items,
		selectedItems: this.props.selected,
		disabledItems: this.props.disabled,
		focusedIndex: null,
		lastSelected: null,
	}

	componentWillReceiveProps(nextProps: IListProps) {
		this.setState(() => ({
			items: nextProps.items,
			selectedItems: nextProps.selected,
			disabledItems: nextProps.disabled,
		}))
	}

	clear() {
		this.setState(() => ({
			selectedItems: [],
			disabledItems: [],
			focusedIndex: null,
			lastSelected: null,
		}))
	}

	select(args: SelectArgs) {
		if (args.index === null) {
			return
		}

		if (includes(this.state.disabledItems, args.index)) {
			return
		}

		this.setState(
			state => {
				let { multiple } = this.props
				let { lastSelected } = state
				let selectedItems = multiple
					? [...state.selectedItems, args.index]
					: [args.index]

				if (
					args.contiguous &&
					multiple &&
					typeof lastSelected === 'number'
				) {
					let start = Math.min(lastSelected, args.index)
					let end = Math.max(lastSelected, args.index)

					selectedItems = uniq([
						...selectedItems,
						...range(start, end + 1),
					])
				}

				return { selectedItems, lastSelected: args.index }
			},
			() => {
				this.props.onChange(
					this.props.multiple
						? this.state.selectedItems
						: this.state.lastSelected,
				)
			},
		)
	}

	deselect(args: SelectArgs) {
		if (args.index === null) {
			return
		}

		this.setState(
			state => {
				let { multiple } = this.props
				let { selectedItems, lastSelected } = state

				if (
					args.contiguous &&
					multiple &&
					typeof lastSelected === 'number'
				) {
					let start = Math.min(lastSelected, args.index)
					let end = Math.max(lastSelected, args.index)

					let toDeselect = range(start, end + 1)
					selectedItems = reject(selectedItems, idx =>
						includes(toDeselect, idx),
					)
				} else {
					selectedItems = reject(selectedItems, idx => idx === args.index)
				}

				return { selectedItems, lastSelected: args.index }
			},
			() => {
				this.props.onChange(
					this.props.multiple ? this.state.selectedItems : null,
				)
			},
		)
	}

	disable(index: number) {
		this.setState(state => ({
			disabledItems: [...state.disabledItems, index],
		}))
	}

	focusIndex(index: null | number = null) {
		// @ts-ignore
		this.setState(state => {
			if (index === null) {
				return {}
			}

			let { focusedIndex, disabledItems } = state

			if (!includes(disabledItems, index) && typeof index === 'number') {
				focusedIndex = index
			}

			return { focusedIndex }
		})
	}

	focusPrevious() {
		this.setState(state => {
			let { focusedIndex, disabledItems } = state
			let lastItem = state.items.length - 1

			if (focusedIndex === null) {
				focusedIndex = lastItem
			} else {
				// focus last item if reached the top of the list
				focusedIndex = focusedIndex <= 0 ? lastItem : focusedIndex - 1
			}

			// skip disabled items
			if (disabledItems.length) {
				while (includes(disabledItems, focusedIndex)) {
					focusedIndex =
						focusedIndex <= 0 ? lastItem : focusedIndex - 1
				}
			}

			return { focusedIndex }
		})
	}

	focusNext() {
		this.setState(state => {
			let { focusedIndex, disabledItems } = state
			let lastItem = state.items.length - 1

			if (focusedIndex === null) {
				focusedIndex = 0
			} else {
				// focus first item if reached last item in the list
				focusedIndex = focusedIndex >= lastItem ? 0 : focusedIndex + 1
			}

			// skip disabled items
			if (disabledItems.length) {
				while (includes(disabledItems, focusedIndex)) {
					focusedIndex =
						focusedIndex >= lastItem ? 0 : focusedIndex + 1
				}
			}

			return { focusedIndex }
		})
	}

	onKeyDown(event: any) {
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

		if (!includes(this.state.selectedItems, index)) {
			this.select({ index, contiguous })
		} else if (this.props.multiple) {
			this.deselect({ index, contiguous })
		}
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
		let items = this.props.items.map((itemContent, index) => {
			let disabled = includes(this.state.disabledItems, index);
			let selected = includes(this.state.selectedItems, index);
			let focused = this.state.focusedIndex === index;
			return (
				<ListItem
					key={index}
					index={index}
					disabled={disabled}
					selected={selected}
					focused={focused}
					onMouseOver={this.focusIndex}
					onChange={this.toggleMouseSelect}
				>
					{itemContent}
				</ListItem>
			);
		});

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
