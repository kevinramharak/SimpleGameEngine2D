import { Logger } from '@/Logger';
import { ISpriteSheetData, SpriteSheet } from '@/Sprite';
import { Constructor, Maybe } from '@/types';

function getImageBitmap(url: string) {
    return new Promise<ImageBitmap>((resolve, reject) => {
        const image = new Image();
        image.addEventListener('error', reject, { once: true });
        image.addEventListener('load', () => createImageBitmap(image).then(bitmap => resolve(bitmap)), { once: true});
        image.src = url;
    });
}

function getSpriteSheetData(url: string) {
    return fetch(url, {
        headers: {
            AcceptType: 'application/json',
        },
    }).then(response => {
        return response.json() as Promise<ISpriteSheetData>;
    });
}

export const AssetManager = new class AssetManager {
    private cache: Record<string, any> = {};

    GetImage(path: string) {
        const cached = this.GetCached<ImageBitmap>(path, ImageBitmap);
        if (cached) {
            return Promise.resolve(cached);
        }
        return getImageBitmap(path).then(bitmap => this.cache[path] = bitmap);
    }

    GetSpriteSheetData(path: string) {
        const cached = this.GetCached<ISpriteSheetData>(path, Object);
        if (cached) {
            return Promise.resolve(cached);
        }
        return getSpriteSheetData(path).then(data => this.cache[path] = data);
    }

    GetSpriteSheet(path: string) {
        const cached = this.GetCached<SpriteSheet>(path, SpriteSheet);
        if (cached) {
            return Promise.resolve(cached);
        }
        const suffix = '.spritesheet';
        return Promise.all([
            this.GetImage(`${path}${suffix}.png`),
            this.GetSpriteSheetData(`${path}${suffix}.json`),
        ]).then(([bitmap, data]) => {
            return this.cache[path] = new SpriteSheet(bitmap, data);
        });
    }

    private GetCached<T>(path: string, type: Constructor): Maybe<T> {
        const cached = this.cache[path];
        if (cached) {
            if (cached instanceof type) {
                return cached as T;
            } else {
                Logger.Error(new Error(`found an item in cache for '${path}, but item is not of type ${type.name}'`)) 
            }
        }
    }
}
