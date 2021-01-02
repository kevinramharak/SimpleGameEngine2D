import { AnimatedSprite } from "./Component/AnimatedSprite";
import { Transform } from './Component/Transform';
import { Game } from './Game';
import { AssetManager } from './AssetManager';
import { ISpriteSheetData, SpriteSheet } from "./Sprite";
import { Input } from './Component/Input';
import { Motion } from './Component/Motion';
import { Vector2D } from './Vector2D';
import { Keyboard } from './Component/Keyboard';
import { Control } from './Component/Control';

const game = new Game();

const spriteData: ISpriteSheetData = {
    width: 50,
    height: 37,
    states: {
        idle: {
            duration: 1200,
            frames: [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 2, y: 0 },
                { x: 3, y: 0 },
            ],
        },
        crouch: {
            duration: 1200,
            frames: [
                { x: 4, y: 0 },
                { x: 5, y: 0 },
                { x: 6, y: 0 },
                { x: 0, y: 1 },
            ]
        },
        run: {
            duration: 1200,
            frames: [
                { x: 1, y: 1 },
                { x: 2, y: 1 },
                { x: 3, y: 1 },
                { x: 4, y: 1 },
                { x: 5, y: 1 },
                { x: 6, y: 1 },
            ],
        },
        jump: {
            duration: 2000,
            frames: [
                { x: 0, y: 2 },
                { x: 1, y: 2 },
                { x: 2, y: 2 },
                { x: 3, y: 2 },
                { x: 1, y: 3 },
                { x: 2, y: 3 },
                { x: 2, y: 3 },
                { x: 2, y: 3 },
                { x: 2, y: 3 },
                { x: 2, y: 3 },
                { x: 2, y: 3 },
            ],
        },
    },
};

document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
        game.Awake();

        const manager = new AssetManager();
        const animated = game.CreateEntity();
        manager.GetImage('/data/player.spritesheet.png').then(bitmap => {
            const spritesheet = new SpriteSheet(bitmap, spriteData);
            const transform = new Transform(Vector2D.from(300, 300));
            const sprite = new AnimatedSprite('foreground', spritesheet);
            const movement = [
                new Input(),
                new Motion(Vector2D.from(0, 0), Vector2D.from(0, 0)),
            ];
            const control = [
                new Keyboard(),
                new Control(),
            ];
            animated.AddComponents(transform, sprite,
                ...movement,
                ...control,
            );
            sprite.SetState('idle');
        });
    }
});

