interface IBasketModel {
	items: Map<string, number>;
	add(id: string): void;
	remove(id: string): void;
}

// class IBasketModel {
// 	items: Map<string, number>;

// 	add(id: string): void {
// 		if (!this.items.has(id)) this.items.set(id, 0); // создаем новый
// 		this.items.set(id, this.items.get(id)! + 1); // прибавляем количество
// 	}

// 	remove(id: string): void {
// 		if (!this.items.has(id)) return; // если нет, то и делать ничего не нужно
// 		if (this.items.get(id)! > 0) {
// 			// если есть и больше нуля, то
// 			this.items.set(id, this.items.get(id)! - 1); // уменьшаем
// 			if (this.items.get(id) === 0) this.items.delete(id); // если опустили до нуля, то удаляем
// 		}
// 	}
// }

export interface IEventEmitter {
	emit: (event: string, data: unknown) => void;
}

export class BasketModel implements IBasketModel {
	items: Map<string, number>;

	constructor(protected events: IEventEmitter) {}

	add(id: string): void {
		//...
		if (!this.items.has(id)) this.items.set(id, 0); // создаем новый
		this.items.set(id, this.items.get(id)! + 1); // прибавляем количество
		this._changed();
	}

	remove(id: string): void {
		//...
		if (!this.items.has(id)) return; // если нет, то и делать ничего не нужно
		if (this.items.get(id)! > 0) {
			// если есть и больше нуля, то
			this.items.set(id, this.items.get(id)! - 1); // уменьшаем
			if (this.items.get(id) === 0) this.items.delete(id); // если опустили до нуля, то удаляем
			this._changed();
		}
	}

	protected _changed() {
		// метод генерирующий уведомление об изменении
		this.events.emit('basket: change', {
			items: Array.from(this.items.keys()),
		});
	}
}
