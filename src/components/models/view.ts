import { IEventEmitter } from './basketModel';

export interface IViewConstructor {
	new (container: HTMLElement, events?: IEventEmitter): IViewConstructor; // на входе контейнер, в него будем выводить
}

export interface IView {
	render(data?: object): HTMLElement; // устанавливаем данные, возвращаем контейнер
}

export class BasketItemView implements IView {
	//элементы внутри контейнера
	protected title: HTMLSpanElement;
	protected addButton: HTMLButtonElement;
	protected removeButton: HTMLButtonElement;

	// данные, которые хотим сохранить на будущее
	protected id: string | null = null;

	constructor(
		protected container: HTMLElement,
		protected events: IEventEmitter
	) {
		// инициализируем, чтобы не искать повторно
		this.title = container.querySelector(
			'.basket-item__title'
		) as HTMLSpanElement;
		this.addButton = container.querySelector(
			'.button.card__button'
		) as HTMLButtonElement;
		this.removeButton = container.querySelector(
			'.basket__item-delete'
		) as HTMLButtonElement;

		// устанавливаем события
		this.addButton.addEventListener('click', () => {
			// генерируем событие в нашем брокере
			this.events.emit('ui:basket-add', { id: this.id });
		});

		this.addButton.addEventListener('click', () => {
			this.events.emit('ui:basket-remove', { id: this.id });
		});
	}

	render(data: { id: string; title: string }) {
		if (data) {
			// если есть новые данные, то запомнить их
			this.id = data.id;
			// и выведем в интерфейс
			this.title.textContent = data.title;
		}
		return this.container;
	}
}

export class BasketView implements IView {
	constructor(protected container: HTMLElement) {}
	render(data: { items: HTMLElement[] }) {
		if (data) {
			this.container.replaceChildren(...data.items);
		}
		return this.container;
	}
}
