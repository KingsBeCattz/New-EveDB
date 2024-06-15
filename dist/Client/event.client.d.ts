type Listener<T = any> = (args: T) => void;
type EventsMap = {
    [key: string]: any;
};
declare class EventEmitter<T extends EventsMap> {
    private events;
    on<K extends keyof T>(event: K, listener: Listener<T[K]>): this;
    once<K extends keyof T>(event: K, listener: Listener<T[K]>): this;
    off<K extends keyof T>(event: K, listener: Listener<T[K]>): this;
    emit<K extends keyof T>(event: K, args: T[K]): boolean;
    removeAllListeners<K extends keyof T>(event?: K): this;
}

export { EventEmitter, type EventsMap, type Listener };
