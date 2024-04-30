import { AppState, CardItem, GalleryChangeEvent } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { BasketItem } from './components/card/BasketItem';
import { CardApi } from './components/card/CardApi';
import { CatalogCard } from './components/card/СatalogCard';
import { PreviewCard } from './components/card/PreviewCard';
import { Basket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import { Order } from './components/common/Order';
import { Page } from './components/page/Page';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { IOrderForm } from './types';
import { Contacts } from './components/common/Contacts';
import { Success } from './components/common/Success';

// Чтобы мониторить все события, для отладки

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const api = new CardApi(CDN_URL, API_URL);
const events = new EventEmitter();

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const page = new Page(document.body, events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

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
				price: item.price,
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

// Изменилось состояние валидации формы
events.on('formErrorsOrder:change', () => {
	const { address } = appData.formErrorsOrder;
	order.valid = !address && appData.order.payment !== null;
	order.errors = Object.values({ address })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось состояние валидации формы
events.on('formErrorsContact:change', (errors: Partial<IOrderForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

// Отправлена форма заказа
events.on('contacts:submit', () => {
	api
		.orderCards(appData.order)
		.then((result) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
					appData.clearBasket();
					events.emit('basket:changed');
				},
			});

			modal.render({
				content: success.render({ total: appData.order.total }),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

// Изменилось одно из полей
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Изменилось одно из полей контактов
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setContactField(data.field, data.value);
	}
);

events.on('payment:method', ({ value }: { value: 'cash' | 'card' }) => {
	appData.order.payment = value;
	events.emit('formErrorsOrder:change');
});

events.on('order:open', () => {
	modal.render({
		content: order.render({
			valid: false,
			address: '',
			errors: [],
		}),
	});
});

events.on('basket:removeItem', (item: CardItem) => {
	appData.removeOrderedCard(item.id);
	events.emit('basket:changed', item);
});

events.on('basket:add', (item: CardItem) => {
	modal.close();
	appData.addOrderedCard(item.id);
	events.emit('basket:changed', item);
});

events.on('basket:changed', () => {
	if (appData.order.total) {
		basket.disabled = false;
	} else {
		basket.disabled = true;
	}
	page.counter = appData.order.items.length;
	basket.items = appData.getBasketCard().map((item) => {
		const card = new BasketItem(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('basket:removeItem', item),
		});
		return card.render(item);
	});

	basket.price = appData.order.total;
});

events.on('basket:open', () => {
	if (appData.order.total) {
		basket.disabled = false;
	} else {
		basket.disabled = true;
	}
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
