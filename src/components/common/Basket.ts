import { Component } from '../base/Component';
import { cloneTemplate, createElement, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/Events';

interface IBasketView {
	items: HTMLElement[];
	price: number;
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._price = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set price(total: number) {
		this.setText(this._price, `${total} синапсов`);
	}

	toggleButton(state: boolean) {
		this.setDisabled(this._button, state);
	}
}
