// import { Film, IFilm } from './film';
// import { Gallery, IGallery } from './common/gallery';
import { View } from './base/view';
// import { Hero } from './common/hero';
import { Card } from './card';
import { EventHandler } from './base/events';

interface IPage {
	counter: number;
	cover: string;
	// content: IFilm;
	// gallery: IGallery;
	content: any;
	gallery: any;
}

interface PageConfiguration {
	modalTemplate: string;
	contentTemplate: string;
}

export class Page extends View<
	HTMLButtonElement,
	IPage,
	'buy-ticket' | 'open-basket',
	'locked'
> {
	// protected _currentFilm: IMovie;
	// protected _filmView: Film;
	// protected _tickets: ITicket[] = [];
	protected _currentFilm: any;
	protected _filmView: any;
	protected _tickets: any = [];

	protected init() {
		this.select('openBasket', '.header__basket').bindEvent(
			'click',
			'open-basket'
		);

		// this.select('hero', '.hero', Hero).on('action', this.trigger('buy-ticket'));

		// this.select('gallery', '.gallery', Gallery);
	}

	set counter(value: number) {
		this.select('counter', '.header__basket-counter').setText(String(value));
	}

	get currentFilm() {
		return this._currentFilm;
	}

	protected selectFilm =
		(film: any): EventHandler =>
		() => {
			this._currentFilm = film;
			this.element<any>('hero').cover = film.cover;
			this._filmView.render(film);
		};

	setFilms(cards: any[], template: string) {
		const items = cards.map((card) =>
			Card.clone<Card>(template, card).on('click', this.selectFilm(card))
		);

		this.element<any>('gallery').render({ items });
		this.selectFilm(cards[0])({ element: items[0] });
		this.element<any>('gallery').setActiveItem({ element: items[0] });
	}

	// configure({ contentTemplate }: any) {
	// 	this._filmView = Card.clone<any>(contentTemplate);
	// 	this.element<any>('gallery').content = this._filmView;
	// 	return this;
	// }
}
