import { ensureElement } from '../../utils/utils';
import { Card, ICardActions } from './Card';

export class BasketItem extends Card {
	protected _title: HTMLElement;
	protected _price: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);
		this._button = container.querySelector(`.basket__item-delete`);

		if (actions?.onClick) {
			this._button.addEventListener('click', actions.onClick);
		}
	}
}
