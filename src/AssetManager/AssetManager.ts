
function getImageBitmap(url: string) {
    return new Promise<ImageBitmap>((resolve, reject) => {
        const image = new Image();
        image.addEventListener('error', reject, { once: true });
        image.addEventListener('load', () => createImageBitmap(image).then(bitmap => resolve(bitmap)), { once: true});
        image.src = url;
    });
}

export class AssetManager {
    private cache: Record<string, ImageBitmap> = {};

    GetImage(path: string) {
        const cached = this.cache[path];
        if (cached) {
            return Promise.resolve(cached);
        }
        return getImageBitmap(path).then(bitmap => this.cache[path] = bitmap);
    }
}
