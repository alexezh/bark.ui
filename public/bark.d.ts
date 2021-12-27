declare namespace bark {
    class NumberProperty {
        private _value;
        id: number;
        constructor(value: number | undefined);
        glide(delta: number, step: number): void;
        add(delta: number): void;
        get(): number;
        set(value: number): void;
    }
    class LinearAnimator {
        prop: NumberProperty;
        delta: number;
        step: number;
        constructor(prop: NumberProperty, delta: number, step: number);
        animate(frameTime: number): boolean;
    }
    class LinearAnimator2 {
        obj: any;
        prop: string;
        delta: number;
        step: number;
        constructor(obj: object, prop: string, delta: number, step: number);
        animate(frameTime: number): boolean;
    }
    class LoopLinearAnimator {
        prop: NumberProperty;
        startDelta: number;
        delta: number;
        step: number;
        direction: number;
        constructor(prop: NumberProperty, delta: number, step: number);
        animate(frameTime: number): boolean;
    }
    class DiscreteAnimator {
        prop: NumberProperty;
        values: number[];
        index: number;
        intervalMs: number;
        lastFrameTimeMs: number;
        constructor(prop: NumberProperty, values: number[], intervalSeconds: number);
        animate(frameTime: number): boolean;
    }
    class PropertyAnimationManager {
        private _props;
        private _props2;
        private _nextKey;
        private onUpdateScene;
        constructor();
        animateLinear(prop: NumberProperty, delta: number, step: number): void;
        animate(prop: NumberProperty, animator: any): void;
        glide(args: {
            obj: any;
            prop: string;
            delta: number;
            step: number;
        }): void;
        animateProperty(args: {
            obj: any;
            prop: string;
            animator: any;
        }): void;
        nextId(): number;
        processAnimation(): any;
    }
    var animator: PropertyAnimationManager;
}
declare namespace bark {
    class Input {
        pressedKeys: any;
        constructor();
        private onKeyDown;
        private onKeyUp;
    }
}
declare namespace bark {
    interface ISpriteSource {
        draw(ctx: any, x: number, y: number, w: number, h: number): void;
    }
    class SpriteImage implements ISpriteSource {
        private _w;
        private _h;
        private _image;
        constructor(name: string, w: number, h: number);
        draw(ctx: any, x: number, y: number, w: number, h: number): void;
    }
    class DynamicImage implements ISpriteSource {
        private _drawFunc;
        constructor(func: any);
        draw(ctx: any, x: number, y: number, w: number, h: number): void;
    }
}
declare namespace bark {
    class Sprite {
        private _skins;
        private _animations;
        private id;
        private flipH;
        private x;
        private y;
        private w;
        private h;
        skin: number;
        get top(): number;
        set top(newValue: number);
        get bottom(): number;
        set bottom(newValue: number);
        get left(): number;
        set left(newValue: number);
        get right(): number;
        set right(newValue: number);
        constructor(args: {
            source?: Sprite;
            x?: number;
            y?: number;
            w?: number;
            h?: number;
            skins?: any[];
            animations?: any[];
        });
        private initSkins;
        draw(ctx: any): void;
        setTimer(timeout: number, func: any): void;
        setXY(x: number, y: number): void;
        clone(x: number, y: number): Sprite;
    }
}
declare namespace bark {
    interface ILevel {
        draw(ctx: any, x: number, w: number): void;
        readonly pixelWidth: number;
        readonly pixelHeight: number;
    }
    enum PosKind {
        Pixel = 0,
        Grid = 1
    }
    class Pos {
        kind: PosKind;
        x: number;
        y: number;
        constructor(kind: PosKind, x: number, y: number);
    }
    class TileLevel implements ILevel {
        private _tileSprites;
        private _rows;
        private _sprites;
        private _tileW;
        private _tileH;
        private _gridW;
        private _gridH;
        get pixelWidth(): number;
        get pixelHeight(): number;
        get gridHeight(): number;
        get gridWidth(): number;
        constructor(args: {
            gridW: number;
            gridH: number;
            tileW: number;
            tileH: number;
        });
        addTileSprite(c: string, sprite: Sprite): void;
        getTileSprite(c: string): Sprite;
        addSprite(sprite: Sprite, x: number, y: number): void;
        createEmptyMap(w: number, h: number): void;
        loadMap(rows: any[]): void;
        draw(ctx: any, x: number, y: number): void;
        getTile(x: number, y: number): any;
        setTile(x: number, y: number, c: string): void;
        getGridPosByPixelPos(x: number, y: number): Pos;
        getTileByPixelPos(x: number, y: number): Sprite;
        getPixelPosByGridPos(x: number, y: number): Pos;
        lookDown(x: number, y: number): any;
    }
}
declare namespace bark {
    class Screen {
        private _width;
        private _height;
        private _level;
        private _canvas;
        private _cameraX;
        private _cameraY;
        private $scrollX;
        get scrollX(): number;
        get width(): number;
        get height(): number;
        setLevel(level: ILevel, width: number, height: number): void;
        run(canvas: any): void;
        _repaint(): void;
        relativePosX(x: number): number;
        setCamera(x: number, y: number): void;
    }
}
declare namespace bark {
    class Game {
        private _screen;
        private _canvas;
        run(screen: Screen): void;
        loadCanvas(canvas: any): void;
        private tryRun;
    }
}
declare namespace bark {
    class Help {
        private _content;
        add(key: string, content: string): void;
    }
}
declare namespace bark {
    var game: Game;
    var screen: Screen;
    var input: Input;
    var project: {
        [id: string]: any;
    };
    function onLoadFrame(canvas: any): void;
}
declare namespace bark {
    class SpriteAtlasImage implements ISpriteSource {
        private _x;
        private _y;
        private _w;
        private _h;
        private _image;
        constructor(atlas: any, x: number, y: number, w: number, h: number);
        draw(ctx: any, x: number, y: number, w: number, h: number): void;
    }
    class SpriteAtlas {
        private _image;
        private _spriteImageW;
        private _spriteImageH;
        private _spriteW;
        private _spriteH;
        constructor(spriteImageW: number, spriteImageH: number, name: string, spriteW: number, spriteH: number);
        createSprite(x: number, y: number, animations: any[]): Sprite;
        createSpriteAnimated(pos: number, interval: number): Sprite;
    }
}
