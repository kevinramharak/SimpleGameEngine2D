import { Component } from './Component';

export class Sprite extends Component {
    constructor(
        public zIndex: number,
    ) {
        super();
    }
}
