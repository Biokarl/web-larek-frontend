import { AppState, CardItem, GalleryChangeEvent } from './components/AppData';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { BasketItem } from './components/card/BasketItem';
import { CardApi } from './components/card/cardApi';
import { CatalogCard } from './components/card/catalogCard';
import { PreviewCard } from './components/card/previewCard';
import { Basket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import { Page } from './components/page/Page';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const api = new CardApi(CDN_URL, API_URL);
const events = new EventEmitter();

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const page = new Page(document.body, events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const cardBasket = cloneTemplate(cardBasketTemplate);

events.on<GalleryChangeEvent>('items:changed', () => {
	page.catalog = appData.gallery.map((item) => {
		const card = new CatalogCard(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render(item);
	});
});

events.on('card:select', (card: CardItem) => {
	appData.setPreview(card);
});

events.on('preview:changed', (item: CardItem) => {
	const showItem = (item: CardItem) => {
		const card = new PreviewCard(cloneTemplate(cardPreviewTemplate), {
			onClick: () => events.emit('basket:add', item),
		});

		modal.render({
			content: card.render({
				title: item.title,
				image: item.image,
				description: item.description,
				category: item.category,
			}),
		});
	};

	if (item) {
		api
			.getCard(item.id)
			.then(() => {
				showItem(item);
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		modal.close();
	}
});

events.on('basket:add', (item: CardItem) => {
	modal.close();
	appData.addOrderedCard(item.id);
	page.counter = appData.order.items.length;
});

events.on('basket:open', () => {
	basket.items = appData.getBasketCard().map((item) => {
		const card = new BasketItem(cardBasket);
		basket.total = appData.getTotal();
		return card.render({ title: item.title, price: item.price });
	});
	modal.render({
		content: createElement<HTMLElement>('div', {}, [basket.render()]),
	});
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

api
	.getAllCards()
	.then(appData.setGallery.bind(appData))
	.catch((err) => {
		console.error(err);
	});
