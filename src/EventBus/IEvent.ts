import { Nullable } from '@/types';
import { EventMap } from './EventMap';
import { EventType } from "./EventType";

export interface IEvent<T extends EventType = EventType, P extends Nullable<unknown> = Nullable<unknown>> {
    readonly type: T;
    readonly detail: P;
    
    readonly defaultPrevented: boolean;
    readonly propagationStopped: boolean;

    preventDefault(): void;
    stopPropagation(): void;
}
