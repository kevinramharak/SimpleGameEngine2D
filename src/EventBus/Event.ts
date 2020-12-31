import { Nullable, Writable } from '@/types';
import { EventType } from './EventType';
import { IEvent } from './IEvent';

export abstract class Event<T extends EventType = EventType, P extends Nullable<unknown> = Nullable<unknown>> implements IEvent<T, P> {
    readonly detail: P;
    readonly type: T;

    readonly defaultPrevented: boolean = false;
    readonly propagationStopped: boolean = false;

    constructor(type: T, detail: P = null as P) {
        this.detail = detail;
        this.type = type;
    }

    stopPropagation() {
        (this as Writable<this>).propagationStopped = true;
    }

    preventDefault() {
        (this as Writable<this>).defaultPrevented = true;
    }

    static Create<T extends EventType = EventType, P extends Nullable<unknown> = Nullable<unknown>>(type: T, detail: P) {
        return new class extends this<T, P> {
            constructor() {
                super(type, detail);
            }
        }
    }
}
