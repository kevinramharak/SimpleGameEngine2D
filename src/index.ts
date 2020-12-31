import { Sprite } from './Component/Sprite';
import { Transform } from './Component/Transform';
import { Entity } from './Entity';
import { Game } from './Game';

const game = new Game();

document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
        game.Awake();

        const player = game.CreateEntity();
        player.AddComponent(new Sprite(1));
        const transform = new Transform({ x: 0, y: 0});
        player.AddComponent(transform);

        setTimeout(() => player.RemoveComponent(transform), 1000);
    }
});
