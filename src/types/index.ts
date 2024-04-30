export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | string;
}

export interface IAppState {
	gallery: ICard[];
}

export interface IOrderForm {
	email: string;
	phone: string;
	address: string;
}

export interface IOrder extends IOrderForm {
	items: string[];
}
