interface IProduct {
	id: string;
	title: string;
}

export interface CatalogModel {
	items: IProduct[];
	setItems(items: IProduct[]): void; // чтобы установить поле загрузки из апи
	getProduct(id: string): IProduct; // чтобы получить при рендере списков
}
