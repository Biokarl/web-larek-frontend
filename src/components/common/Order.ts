import { IOrderForm } from '../../types';
import { IEvents } from '../base/Events';
import { Form } from './Form';

export class Order extends Form<IOrderForm> {
	protected _card: HTMLButtonElement;
	protected _cash: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._card = container.querySelector('[name="card"]');
		this._cash = container.querySelector('[name="cash"]');

		if (this._card) {
			this._card.addEventListener('click', () => {
				if (!this._card.classList.contains('button_alt-active')) {
					this.toggleClass(this._card, 'button_alt-active');
				}
				if (this._cash.classList.contains('button_alt-active')) {
					this._cash.classList.remove('button_alt-active');
				}
				events.emit('payment:method', { value: 'card' });
			});
		}
		if (this._cash) {
			this._cash.addEventListener('click', () => {
				if (this._card.classList.contains('button_alt-active')) {
					this._card.classList.remove('button_alt-active');
				}
				if (!this._cash.classList.contains('button_alt-active')) {
					this._cash.classList.add('button_alt-active');
				}
				events.emit('payment:method', { value: 'cash' });
			});
		}
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
