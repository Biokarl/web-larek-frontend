import { ensureElement } from '../../utils/utils';
import { Card, ICardActions } from './cardView';

export class PreviewCard extends Card {
	protected _status: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);
		// this._status = ensureElement<HTMLElement>(`.card__status`, container);
	}

	set status(content: HTMLElement) {
		this._status.replaceWith(content);
	}
}
