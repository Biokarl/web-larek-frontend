import { ensureElement } from '../../utils/utils';
import { Card, ICardActions } from './Card';

export class PreviewCard extends Card {
	protected _category: HTMLElement;
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;
	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);
		this._image = ensureElement<HTMLImageElement>(`.card__image`, container);
		this._category = ensureElement<HTMLElement>(`.card__category`, container);
	}

	set category(value: string) {
		const statuses: { [key: string]: string } = {
			'софт-скил': 'soft',
			дополнительное: 'additional',
			кнопка: 'button',
			другое: 'other',
			'хард-скил': 'hard',
		};
		this.setText(this._category, value);

		this._category.className = `card__category card__category_${statuses[value]}`;
	}

	get category(): string {
		return this._category.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}
}
