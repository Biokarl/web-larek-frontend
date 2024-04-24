import { Api } from './components/base/api';
import { CardAPI } from './components/cardAPI';
import { Page } from './components/page';
import './scss/styles.scss';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { ensureElement } from './utils/utils';

// const root = ensureElement<HTMLElement>('main.gallery');
const page = Page.mount<Page>('.page');

const api = new CardAPI(CDN_URL, API_URL);

api
	.getCards()
	.then((cards) => {
		page.setFilms(cards, settings.cardCatalogTemplate);
		console.log(cards);
	})
	.catch((err: string) => console.log(`Error: `, err));

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
