import { Motion } from '@/Component/Motion';
import { Transform } from '@/Component/Transform';
import { EntityMask } from '@/Entity/EntityMask';
import { EventBus } from '@/EventBus';
import { Game } from '@/Game';
import { Settings } from '@/Settings';
import { Delta } from '@/Time';
import { Vector2D } from '@/Vector2D';
import { System } from '../System';

export class MotionPhysics extends System<[Transform, Motion]> {
    constructor(game: Game, eventbus: EventBus) {
        super(game, eventbus, new EntityMask([
            Transform,
            Motion,
        ]));
    }

    Update(delta: Delta) {
        this.entities.forEach(entity => {
            const [transform, motion] = this.game.GetEntityComponents(entity, ...this.signature.mask);

            // see: https://gafferongames.com/post/integration_basics/#semi-implicit-euler
            motion.velocity = Vector2D.add(motion.velocity, Vector2D.multiply(motion.acceleration, delta));
            transform.position = Vector2D.add(transform.position, Vector2D.multiply(motion.velocity, delta));

            motion.velocity = Vector2D.limit(motion.velocity, 0, 1);
            transform.position = Vector2D.limit(transform.position, 0, Settings.Canvas.size.y);
        });
    }

    Awake() {
    }

    Destroy() {
    }
}
