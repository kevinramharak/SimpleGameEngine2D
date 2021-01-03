import { Component } from './Component';

export interface IInputState {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    attack: boolean;
    jump: boolean;
}

/**
 * @abstract
 */
export class Input extends Component {
    state: IInputState = {
        left: false,
        right: false,
        up: false,
        down: false,
        attack: false,
        jump: false,
    };

    /**
     * @abstract
     * // TODO: figure out how to make this generic?
     */
    Receive(state: Record<string, boolean>) {}
}
