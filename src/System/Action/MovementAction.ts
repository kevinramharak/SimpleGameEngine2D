import { Movement } from '@/Component/Movement';
import { Input } from '@/Component/Input';
import { EntityMask } from '@/Entity/EntityMask';
import { EventBus } from '@/EventBus';
import { Game } from '@/Game';

import { System } from '../System';
import { Motion } from '@/Component/Motion';

export class MovementAction extends System<[Movement, Input, Motion]> {
    constructor(game: Game, eventbus: EventBus) {
        super(game, eventbus, new EntityMask([
            Movement,
            Input,
            Motion,
        ]));
    }

    Update() {
        this.entities.forEach(entity => {
            const [movement, input, motion] = this.game.GetEntityComponents(entity, ...this.signature.mask);
            movement.Move(input, motion);
        });
    }

    Awake() {
    }

    Destroy() {

    }
}
