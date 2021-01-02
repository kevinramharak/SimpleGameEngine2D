import { Brand } from '@/types/Brand';
import { asInt } from '@/util';

export type FrameId = Brand<ReturnType<typeof requestAnimationFrame>, 'FrameId'>;
export type Timestamp = Brand<number, 'Timestamp'>;
export type Delta = Brand<number, 'Delta'>;

export function now(): Timestamp {
    return asInt(performance.now()) as Timestamp;
}

export function frame(callback: (timestamp: Timestamp) => void) {
    return requestAnimationFrame(() => callback(now())) as FrameId;
}

export function benchmark(callback: () => void) {
    const before = now();
    callback();
    return (now() - before) as Delta;
}
