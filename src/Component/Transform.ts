import { Component } from './Component';
import { IVector2D } from '@/Vector2D';

export class Transform extends Component implements IVector2D {
    constructor(
        public x: number,
        public y: number,
    ) {
        super();
    }
}
