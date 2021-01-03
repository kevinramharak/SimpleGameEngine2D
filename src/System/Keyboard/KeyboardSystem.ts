import { Keyboard } from '@/Component/Keyboard';
import { EntityMask } from '@/Entity/EntityMask';
import { EventBus } from '@/EventBus';
import { Game } from '@/Game';

import { System } from '../System';

export class KeyboardSystem extends System<[Keyboard]> {
    private state = {} as Record<string, boolean>;
    constructor(game: Game, eventbus: EventBus) {
        super(game, eventbus, new EntityMask([
            Keyboard,
        ]));
    }

    Update() {
        this.entities.forEach(entity => {
            const [keyboard] = this.game.GetEntityComponents(entity, ...this.signature.mask);
            keyboard.Receive(this.state);
        });
    }

    Awake() {
        // setup event listeners
        document.addEventListener('keydown', (event) => {
            this.state[event.code] = true;
        });
        document.addEventListener('keyup', (event) => {
            this.state[event.code] = false;
        });
    }

    Destroy() {

    }
}
