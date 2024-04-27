import { EventEmitter } from './components/base/events';
import { CardAPI } from './components/cardAPI';
import { BasketModel } from './components/models/basketModel';
import { BasketItemView, BasketView } from './components/models/view';
import { Page } from './components/page';
import './scss/styles.scss';
import { API_URL, CDN_URL, settings } from './utils/constants';

// const root = ensureElement<HTMLElement>('main.gallery');

// const page = Page.mount<Page>('.page');

// const api = new CardAPI(CDN_URL, API_URL);

// api
// 	.getCards()
// 	.then((cards) => {
// 		page.setFilms(cards, settings.cardCatalogTemplate);
// 		console.log(cards);
// 	})
// 	.catch((err: string) => console.log(`Error: `, err));

// ???????????????????????????????????????????????????

const events = new EventEmitter();

const basket = new BasketModel(events);

events.on('basket:change', (data: { items: string[] }) => {
	// выводим куда-то
});

// инициализация

const api = new ShopAPI();
const basketView = new BasketView(document.querySelector('.basket'));
const basketModel = new BasketModel(events);
const catalogModel = new CatalogModel(events);

// можно собрать в функции или классы отдельные экраны с логикой их оформления
function renderBasket(items: string[]) {
	basketView.render(
		items.map((id) => {
			const itemView = new BasketItemView(events);
			return itemView.render(catalogModel.getProduct(id));
		})
	);
}

// при изменении рендерим
events.on('basket:change', (event: { items: string[] }) => {
	renderBasket(event.items);
});

// при действиях изменяем модель, а после этого случится рендер
events.on('ui:basket-add', (event: { id: string }) => {
	basketModel.add(event.id);
});

events.on('ui:basket-remove', (event: { id: string }) => {
	basketModel.remove(event.id);
});

// подгружаем начальные данные и запускаем процессы
api
	.getCatalog()
	.then(catalogModel.setItems.bind(catalogModel))
	.catch((err) => console.log(err));

// ================================================================

// class Card extends View {
//     protected _image: HTMLImageElement;
//     protected _title: HTMLSpanElement;

//     constructor(root: HTMLDivElement, name:string){
//         super(root, name);

//         this._image = this.ensure(`${this.name}_image`) as HTMLImageElement;
//         this._title = this.ensure(`${this.name}_title`) as HTMLSpanElement;

//     }

//     set image(src:string) {
//         this.setLink(this._image, src);
//     }

//     set title(text:string) {
//         this.setText(this._image, text);
//         this.setText(this._title, text);
//     }

//     onClick(handler: (args: {event: Event, el: Card}) => void) {
//         this.on(this.node, 'click', handler)
//     }
// }
