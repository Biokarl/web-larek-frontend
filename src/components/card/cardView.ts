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
		// this._image = ensureElement<HTMLImageElement>(
		// 	`.${blockName}__image`,
		// 	container
		// );
		this._button = container.querySelector(`.${blockName}__button`);
		// this._description = container.querySelector(`.${blockName}__description`);
		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
		// this._category = ensureElement<HTMLElement>(
		// 	`.${blockName}__category`,
		// 	container
		// );

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

	// set category(value: string) {
	// 	const statuses: { [key: string]: string } = {
	// 		'софт-скил': 'soft',
	// 		дополнительное: 'additional',
	// 		кнопка: 'button',
	// 		другое: 'other',
	// 		'хард-скил': 'hard',
	// 	};
	// 	this.setText(this._category, value);

	// 	this._category.className = `card__category card__category_${statuses[value]}`;
	// }

	// get category(): string {
	// 	return this._category.textContent || '';
	// }

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}
}
