import { ICardProps } from '../types';
import { Api, ApiListResponse } from './base/api';

export interface ICardAPI {
	getCards: () => Promise<ICardProps[]>;
}

export class CardAPI extends Api implements ICardAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getCards(): Promise<ICardProps[]> {
		return this.get('/product').then((data: ApiListResponse<ICardProps>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}
}
// api.get('/product').then((res: ApiListResponse<ICardProps>) => {
// 	res.items.forEach((item) => {
// 		const card = new Card(root, { ...item, image: CDN_URL + item.image });
// 		card.render();
// 	});
// });
