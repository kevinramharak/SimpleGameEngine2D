import { Brand } from '@/types/Brand';
import { asInt } from '@/util';

export type FrameId = ReturnType<typeof requestAnimationFrame>;
export type Timestamp = Brand<number, 'Timestamp'>;
export type Delta = Brand<number, 'Delta'>;

export function now(): Timestamp {
    return asInt(performance.now()) as Timestamp;
}

export function frame(callback: (timestamp: Timestamp) => void): FrameId {
    return requestAnimationFrame(() => callback(now()));
}
