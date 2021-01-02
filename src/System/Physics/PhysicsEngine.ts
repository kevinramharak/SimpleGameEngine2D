import { Motion } from '@/Component/Motion';
import { Transform } from '@/Component/Transform';
import { EntityMask } from '@/Entity/EntityMask';
import { EventBus } from '@/EventBus';
import { Game } from '@/Game';
import { Delta } from '@/Time';
import { asInt } from '@/util';
import { Vector2D } from '@/Vector2D';
import { System } from '../System';


export class PhysicsEngine extends System<[Transform, Motion]> {
    constructor(game: Game, eventbus: EventBus) {
        super(game, eventbus, new EntityMask([
            Transform,
            Motion,
        ]));
    }

    Update(delta: Delta) {
        const time = asInt(delta / 10);
        this.entities.forEach(entity => {
            const [transform, motion] = this.game.GetEntityComponents(entity, ...this.signature.mask);
            const position = Vector2D.writable(transform.position);
            const acceleration = Vector2D.writable(motion.acceleration);
            const velocity = Vector2D.writable(motion.velocity);

            

            transform.position = Vector2D.from(position).absolute();
        });
    }

    Awake() {
    }

    Destroy() {
    }
}
