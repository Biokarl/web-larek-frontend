import { FormErrors, IAppState, ICard, IOrder, IOrderForm } from '../types';
import { Model } from './base/Model';
import _ from 'lodash';

export type GalleryChangeEvent = {
	gallery: CardItem[];
};

export class CardItem extends Model<ICard> {
	description: string;
	id: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export class AppState extends Model<IAppState> {
	gallery: ICard[];
	preview: string;
	order: IOrder = {
		payment: null,
		total: 0,
		email: '',
		phone: '',
		address: '',
		items: [],
	};
	formErrorsOrder: FormErrors = {};
	formErrorsContact: FormErrors = {};

	getBasketCard(): ICard[] {
		return this.gallery.filter((item) => this.order.items.includes(item.id));
	}

	setGallery(items: ICard[]) {
		this.gallery = items.map((item) => new CardItem(item, this.events));
		this.emitChanges('items:changed', { gallery: this.gallery });
	}

	setPreview(item: CardItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	getTotal() {
		return this.order.items.reduce(
			(a, c) => a + +this.gallery.find((it) => it.id === c).price,
			0
		);
	}

	addOrderedCard(id: string) {
		this.order.items = _.uniq([...this.order.items, id]);
		this.order.total = this.getTotal();
	}

	removeOrderedCard(id: string) {
		this.order.items = _.without(this.order.items, id);
		this.order.total = this.getTotal();
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (this.validateOrder()) {
			// this.events.emit('order:ready', this.order);
		}
	}

	setContactField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (this.validateContact()) {
			this.events.emit('order:ready', this.order);
		}
	}

	clearBasket() {
		this.order.items = [];
		this.order.total = 0;
	}

	validateOrder() {
		const errors: typeof this.formErrorsOrder = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrorsOrder = errors;
		this.events.emit('formErrorsOrder:change', this.formErrorsOrder);
		return Object.keys(errors).length === 0;
	}

	validateContact() {
		const errors: typeof this.formErrorsContact = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		this.formErrorsContact = errors;
		this.events.emit('formErrorsContact:change', this.formErrorsContact);
		return Object.keys(errors).length === 0;
	}
}
