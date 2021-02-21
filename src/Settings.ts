import { asInt } from './util';
import { Vector2D } from './Vector2D';

export const Settings = ({
    debug: true,
    engines: {
        loop: {
            ups: 30,
            warn: 5,
        },
    },
    Canvas: {
        size: new Vector2D(400, 400),
        scale: new Vector2D(4, 4),
    },
} as const);
