import { asInt } from './util';

/**
 * Calculates the interval to represent the `amount` of updates per seconds in milliseconds
 */
function ups(amount: number) {
    return asInt(1000 / amount);
}

export const Settings = ({
    debug: true,
    engines: {
        render: {
            ups: ups(30),
            warn: 5,
        },
    },
} as const);
