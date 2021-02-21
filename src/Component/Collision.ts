import { CollisionType } from '@/System/Physics/CollisionPhysics';
import { Component } from './Component';

export class Collision<T extends CollisionType = CollisionType> extends Component {
    constructor(
        public type: T,
    ) {
        super();
    }
}
