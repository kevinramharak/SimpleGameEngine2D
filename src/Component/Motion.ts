import { Component } from './Component';
import { IVector2D } from '@/Vector2D';

export class Motion extends Component {
    constructor(
        public velocity: IVector2D,
        public acceleration: IVector2D,
    ) {
        super();
    }
}
