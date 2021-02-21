
import { Vector2D } from '@/Vector2D';
import { Component } from './Component';
import { Input } from './Input';
import { Motion } from './Motion';

export class Gravity extends Component {
    constructor(
        public mass: number
    ) {
        super();
    }
}

