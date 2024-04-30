import { IAppState, ICard, IOrder } from '../types';
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
		email: '',
		phone: '',
		address: '',
		items: [],
	};

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
	}

	removeOrderedCard(id: string) {
		this.order.items = _.without(this.order.items, id);
	}
}
