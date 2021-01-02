import { Game } from '@/Game';
import { EntityMask } from '@/Entity/EntityMask';
import { Keyboard } from '@/Component/Keyboard';
import { EventBus } from '@/EventBus';
import { System } from '../System';


export class KeyboardSystem extends System<[Keyboard]> {
    constructor(game: Game, eventbus: EventBus) {
        super(game, eventbus, new EntityMask([
            Keyboard,
        ]));
    }

    Update() {
        this.entities.forEach(entity => {
            const [keyboard] = this.game.GetEntityComponents(entity, ...this.signature.mask);
        });
    }

    Awake() {
        // setup event listeners
    }

    Destroy() {
        // remove event listeners
    }
}
