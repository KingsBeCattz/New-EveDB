export type Listener<T = any> = (args: T) => void;

export type EventsMap = {
	[key: string]: any;
};

export class EventEmitter<T extends EventsMap> {
	private events: { [K in keyof T]?: Listener<T[K]>[] } = {};

	public on<K extends keyof T>(event: K, listener: Listener<T[K]>): this {
		if (!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event]!.push(listener);
		return this;
	}

	public once<K extends keyof T>(event: K, listener: Listener<T[K]>): this {
		const onceListener: Listener<T[K]> = (args) => {
			this.off(event, onceListener);
			listener(args);
		};
		return this.on(event, onceListener);
	}

	public off<K extends keyof T>(event: K, listener: Listener<T[K]>): this {
		if (!this.events[event]) return this;

		this.events[event] = this.events[event]!.filter((l) => l !== listener);
		return this;
	}

	public emit<K extends keyof T>(event: K, args: T[K]): boolean {
		if (!this.events[event]) return false;

		this.events[event]!.forEach((listener) => listener(args));
		return true;
	}

	public removeAllListeners<K extends keyof T>(event?: K): this {
		if (event) {
			delete this.events[event];
		} else {
			this.events = {};
		}
		return this;
	}
}
