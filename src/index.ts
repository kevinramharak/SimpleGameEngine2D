import { AnimatedSprite } from "./Component/AnimatedSprite";
import { Transform } from './Component/Transform';
import { Game } from './Game';
import { AssetManager } from './AssetManager';
import { ISpriteSheetData, SpriteSheet } from "./Sprite";
import { Motion } from './Component/Motion';
import { IVector2D, IVector2DTuple, Vector2D } from './Vector2D';
import { Keyboard } from './Component/Keyboard';
import { Movement } from './Component/Movement';
import { Gravity } from './Component/Gravity';
import { Color } from './Color';
import { random } from './Random';
import { Render } from './Component/Render';
import { Delta } from './Time';
import { Canvas } from './Canvas';
import { Collision } from './Component/Collision';
import { CollisionType } from './System/Physics';
import { Font } from './Font';

function onDocumentReady(handler: () => void) {
    if (document.readyState !== 'loading') {
        document.addEventListener('DOMContentLoaded', handler, { once: true });
    } else {
        handler();
    }
}

onDocumentReady(() => {
    const game = new Game();
    game.Awake();

    class RenderBall extends Render {
        constructor(public color: Color) {
            super('foreground');
        }

        Render(delta: Delta, layer: Canvas, position: IVector2D, size: IVector2D) {
            layer.FillCircle(position, size.x, this.color);
            layer.FillText(position, `${position.x}:${position.y}`, new Font({
                size: 8,
            }), Color.Map.black);
        }
    }

    function createBall(color: Color) {
        return game.CreateEntity(
            new Transform({ x: random(100, 200), y: random(100, 200) }, { x: 20, y: 20 }),
            new Motion({ x: 0, y: 0 }, { x: 0, y: 0 }),
            new RenderBall(color),
            new Gravity(1),
            new Collision(CollisionType.Circle),
        );
    }

    const AMOUNT = 2;
    for(let i = 0; i < AMOUNT; i++) {
        createBall(Color.Random());
    }

    // AssetManager.GetSpriteSheet('/assets/player').then(spritesheet => {
    //     const animated = game.CreateEntity(
    //         new AnimatedSprite('foreground', spritesheet),
    //         new Transform(
    //             new Vector2D(300, 300),
    //             new Vector2D(spritesheet.data.width, spritesheet.data.height),
    //         ),
    //         new Motion(new Vector2D(0, 0), new Vector2D(0, 0)),
    //         new Gravity(1),
    //         new Movement(),
    //         new Keyboard(),
    //     );
    //     animated.GetComponent(AnimatedSprite).SetState('idle');
    // });
})