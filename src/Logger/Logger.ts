import { Tuple } from '@/types';

type LogArgs = Tuple<string | { toString(): string }>;

export class Logger {
    static Info<A extends LogArgs>(...args: A) {
        console.log(`[INFO]  - `, ...args);
    }

    static Warn<A extends LogArgs>(...args: A) {
        console.warn(`[WARN]  - `, ...args);
    }

    static Error<A extends LogArgs>(error: Error, ...args: A): never {
        if (args.length) {
            console.error(`[ERROR] - `, ...args);
        }
        throw error;
    }
}
