import { LookupTable, ValueOf } from '@/types';
import { Event } from './Event';
import { EventMap } from "./EventMap";
import { EventType } from './EventType';

export type IEventListener<E extends Event> = (event: E) => void;

// TODO: make this generic again
export class EventBus {
    private listeners = {} as { [K in EventType]: IEventListener<ValueOf<EventMap>>[] };

    dispatch<Type extends EventType>(type: Type, event: EventMap[Type]): boolean {
        const listeners = this.listeners[type];
        if (listeners && listeners.length > 0) {
            let index = 0;
            while (!event.propagationStopped && index < listeners.length) {
                const listener = listeners[index++];
                listener(event);
            }
        }
        return event.defaultPrevented;
    }

    on<Type extends EventType, Listener extends IEventListener<EventMap[Type]>>(type: Type, listener: Listener) {
        const listeners = this.listeners[type] || (this.listeners[type] = []) as Listener[];
        if (!listeners.includes(listener as unknown as IEventListener<ValueOf<EventMap>>)) {
            listeners.push(listener as unknown as IEventListener<ValueOf<EventMap>>);
        }
    }

    once<Type extends EventType>(type: Type, listener: IEventListener<EventMap[Type]>) {
        const intermediate = ((event: EventMap[Type]) => {
            listener(event);
            this.off(type, intermediate);
        }) as IEventListener<EventMap[Type]>;
        this.on(type, intermediate);
    }

    off<Type extends EventType>(type: Type, listener: IEventListener<EventMap[Type]>) {
        const listeners = this.listeners[type];
        if (listeners && listeners.length > 0) {
            const index = listeners.indexOf(listener as unknown as IEventListener<ValueOf<EventMap>>);
            if (index >= 0) {
                listeners.splice(index, 1);
            }
        }
    }
}
