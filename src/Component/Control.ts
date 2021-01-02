import { Component } from './Component';
import { Input } from './Input';

/**
 * @abstract
 */
export class Control extends Component {
    /**
     * @abstract
     */
    Manipulate(input: Input) {}
}
