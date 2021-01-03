import { Component } from './Component';
import { IVector2D } from '@/Vector2D';

export class Transform extends Component {
    constructor(
        public position: IVector2D,
        public size: IVector2D,
    ) {
        super();
    }
}
