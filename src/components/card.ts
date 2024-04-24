import { View } from './base/view';

interface ICard {
	// init: () => void;
	image: string;
}

const cardCategoryInColor: { [key: string]: string } = {
	кнопка: 'button',
	другое: 'other',
	дополнительное: 'additional',
	'хард-скил': 'hard',
	'софт-скил': 'soft',
};

export class Card extends View<HTMLButtonElement, ICard, 'click', never> {
	protected init() {
		this.bindEvent('click');
	}

	set image(src: string) {
		this.element('image').setLink(src);
	}

	// this._card = createElement<HTMLButtonElement>('button', {
	// 	className: 'gallery__item card',
	// });
	// this._category = createElement<HTMLElement>('span', {
	// 	className: `card__category card__category_${cardCategoryInColor[category]}`,
	// 	textContent: category,
	// });
	// this._title = createElement<HTMLElement>('h2', {
	// 	className: 'card__title',
	// 	textContent: title,
	// });
	// this._image = createElement<HTMLImageElement>('img', {
	// 	className: 'card__image',
	// 	src: image,
	// });
	// this._price = createElement<HTMLElement>('span', {
	// 	className: 'card__price',
	// 	textContent: price === null ? 'Бесценно' : String(price) + ' синапсов',
	// });

	// this._card.append(this._category, this._title, this._image, this._price);

	// this.container.append(this._card);
}
