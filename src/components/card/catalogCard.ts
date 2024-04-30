import { ensureElement } from '../../utils/utils';
import { Card, ICardActions } from './cardView';

export interface CatalogStatus {
	_category: HTMLElement;
	_title: HTMLElement;
	_image: HTMLImageElement;
	_price: HTMLElement;
}

export class CatalogCard extends Card {
	protected _category: HTMLElement;
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);
		this._category = ensureElement<HTMLElement>(`.card__category`, container);
		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._image = ensureElement<HTMLImageElement>(`.card__image`, container);
		this._price = ensureElement<HTMLElement>(`.card__price`, container);
	}
}
