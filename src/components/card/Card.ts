import { ICard } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _category?: HTMLElement;
	protected _price?: HTMLElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._button = container.querySelector(`.${blockName}__button`);
		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set price(value: string) {
		const text = value === null ? 'Бесценно' : `${value} синапсов`;
		this.setText(this._price, text);
	}

	get price(): string {
		return this._price.textContent || '';
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	toggleButton(state: boolean) {
		this.setDisabled(this._button, state);
	}
}
