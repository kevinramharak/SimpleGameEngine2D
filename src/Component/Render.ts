import { Canvas } from '@/Canvas';
import { IRender } from '@/Lifecycle';
import { Delta } from '@/Time';
import { Brand } from '@/types/Brand';
import { IVector2D } from '@/Vector2D';
import { Component } from './Component';

/**
 * @abstract
 */
export class Render extends Component implements IRender<[Canvas, IVector2D]> {
    constructor(
        public layer: 'background' | 'foreground',
    ) {
        super();
    }

    /**
     * @abstract 
     */
    Render(delta: Delta, layer: Canvas, position: IVector2D): void {};
}
