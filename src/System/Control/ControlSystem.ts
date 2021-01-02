import { Control } from '@/Component/Control';
import { Input } from '@/Component/Input';
import { EntityMask } from '@/Entity/EntityMask';
import { EventBus } from '@/EventBus';
import { Game } from '@/Game';

import { System } from '../System';

export class ControlSystem extends System<[Control, Input]> {
    constructor(game: Game, eventbus: EventBus) {
        super(game, eventbus, new EntityMask([
            Control,
            Input,
        ]));
    }

    Update() {
        this.entities.forEach(entity => {
            const [control, input] = this.game.GetEntityComponents(entity, ...this.signature.mask);
            control.Manipulate(input);
        });
    }

    Awake() {

    }

    Destroy() {

    }
}
