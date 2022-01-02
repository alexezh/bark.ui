export default class AsyncEventSource<T> {
    private _callbacks;
    add(func: T): void;
    remove(func: T): void;
    private invokeWorker;
    invoke(...args: any[]): void;
    invokeWithCompletion(onInvoke: () => void, ...args: any[]): void;
}

export declare class CodeBlockDef extends ObjectDef implements IStorageOpReceiver {
    name: string;
    code: string;
    codeId: string;
    constructor(storage: IProjectStorage, parent: IObjectDef, id: string | undefined, name: string, code: string, codeId?: string | undefined);
    updateCode(code: string): void;
    static fromOp(storage: IProjectStorage, parent: IObjectDef, id: string, op: any): CodeBlockDef;
    processSet(op: any): void;
    processAdd(childId: string, op: any): void;
    private createUpdateOp;
}
export declare class CodeFileDef extends ObjectDef implements IStorageOpReceiver {
    name: string;
    codeBlocks: CodeBlockDef[];
    constructor(storage: IProjectStorage, parent: IObjectDef | undefined, id: string | undefined, name?: string | undefined);
    createBlock(name: string, code: string): void;
    get firstBlock(): CodeBlockDef | undefined;
    static fromOp(storage: IProjectStorage, parent: IObjectDef, id: string, op: any): CodeFileDef;
    processSet(op: any): void;
    processAdd(childId: string, op: any): void;
    private createUpdateOp;
}

export declare enum ImageFormat {
    svg = 0,
    png = 1
}
export declare class ImageData {
    readonly image: string | undefined;
    readonly imageFormat: ImageFormat;
    readonly imageId: string | undefined;
    constructor(imageFormat: ImageFormat, image: string, imageId?: string | undefined);
    static isEqual(a: ImageData | undefined, b: ImageData | undefined): boolean;
}
export declare class CostumeDef extends ObjectDef implements IStorageOpReceiver {
    name: string;
    imageData: ImageData | undefined;
    private _version;
    private _cachedSpriteSource;
    get version(): number;
    constructor(storage: IProjectStorage, parent: IObjectDef, id: string | undefined);
    updateImage(imageData: ImageData): void;
    static fromOp(storage: IProjectStorage, parent: IObjectDef, id: string, op: any): CostumeDef;
    processSet(op: any): void;
    processAdd(childId: string, op: any): void;
    getSpriteSource(): CostumeImage;
    private createUpdateOp;
}
export declare class CostumeImage implements ISpriteSource {
    private _image;
    private _costumeVersion;
    private _costume;
    constructor(costume: CostumeDef);
    draw(ctx: any, x: number, y: number, w: number, h: number): void;
    private loadImage;
}

export declare enum StorageOpKind {
    remove = "remove",
    set = "set",
    append = "append",
    screenReady = "screenReady",
    selectSprite = "selectSprite"
}
export declare class StorageOp {
    readonly kind: StorageOpKind;
    readonly id: string;
    readonly parent: string | undefined;
    readonly value: any;
    constructor(kind: StorageOpKind, id: string, parent?: string | undefined, value?: any);
}
export interface IStorageOpReceiver {
    processSet(op: any): void;
    processAdd(childId: string, op: any): void;
}
export interface IProjectStorage {
    updateSnapshot(json: string): void;
    setItem(id: string, parent: string | undefined, value: any): void;
    removeItem(id: string): void;
    appendItems(id: string, parent: string | undefined, value: any[]): void;
    processRemoteOp(op: StorageOp): void;
    registerOnChange(func: (op: StorageOp[]) => void): void;
    unregisterOnChange(func: (op: StorageOp[]) => void): void;
    registerReceiver(id: string, receiver: IStorageOpReceiver): void;
    toJson(): string;
}

export interface IObjectDef {
    get id(): string;
}
export declare class ObjectDef implements IObjectDef {
    id: string;
    parent: IObjectDef | undefined;
    protected _storage: IProjectStorage;
    constructor(storage: IProjectStorage, parent: IObjectDef | undefined, id?: string | undefined, tag?: string | undefined);
}

export declare class Project {
    readonly screen: ScreenDef;
    readonly _storage: ProjectLocalStorage;
    get storage(): IProjectStorage;
    constructor(storage: ProjectLocalStorage, def: ScreenDef);
    static createEmptyProject(): Project;
    forEachSprite(func: (file: SpriteDef) => void): void;
    forEachCodeFile(func: (file: CodeFileDef) => void): void;
    findCodeFileById(id: string): CodeFileDef | undefined;
    findSpriteById(id: string): SpriteDef | undefined;
    registerOnChange(): void;
}

export declare class ProjectLoader {
}

export declare class ProjectLocalStorage implements IProjectStorage {
    private _data;
    private _receivers;
    private _onChange;
    private _changeQueue;
    private _updatePending;
    constructor();
    updateSnapshot(json: string): void;
    setItem(id: string, parent: string | undefined, value: any): void;
    removeItem(id: string): void;
    appendItems(id: string, parent: string | undefined, value: any[]): void;
    processRemoteOp(op: StorageOp): void;
    private processSetOp;
    private queueChange;
    private onInvokeComplete;
    registerOnChange(func: (op: StorageOp[]) => void): void;
    unregisterOnChange(func: (op: StorageOp[]) => void): void;
    registerReceiver(id: string, receiver: IStorageOpReceiver): void;
    private makePopulateOp;
    private makePopulateList;
    toJson(): string;
}

export declare class Screen {
    private _def;
    private _level;
    private _canvas;
    private _width;
    private _height;
    private _cameraX;
    private _cameraY;
    private _scrollX;
    private _editMode;
    get scrollX(): number;
    get width(): number;
    get height(): number;
    constructor(def: ScreenDef);
    setLevel(level: ILevel): void;
    setCanvas(canvas: any): void;
    setEditMode(edit: boolean): void;
    onScreenChange(): void;
    _repaint(): void;
    relativePosX(x: number): number;
}

export declare class ScreenDef extends ObjectDef implements IStorageOpReceiver {
    private _sprites;
    private _level;
    private _codeFile;
    get sprites(): SpriteDefCollection;
    get level(): TileLevelDef;
    get codeFile(): CodeFileDef;
    readonly onChange: AsyncEventSource<() => void>;
    props: {
        screenWidth: number;
        screenHeight: number;
    };
    constructor(storage: IProjectStorage, props?: {
        screenWidth: number;
        screenHeight: number;
    } | undefined);
    createLevel(props: TileLevelProps): TileLevelDef;
    processSet(op: any): void;
    processAdd(childId: string, op: any): void;
    private createUpdateOp;
    setSize(screenWidth: number, screenHeight: number): void;
    createSprite(name: string): SpriteDef;
}

export declare type SpriteProps = {
    x: number;
    y: number;
    w: number;
    h: number;
    flipH: boolean;
};
export declare class Sprite {
    private _def;
    private _costumeIndex;
    private id;
    private props;
    get top(): number;
    set top(newValue: number);
    get bottom(): number;
    set bottom(newValue: number);
    get left(): number;
    set left(newValue: number);
    get right(): number;
    set right(newValue: number);
    constructor(def: SpriteDef, props: SpriteProps);
    draw(ctx: any): void;
    setTimer(timeout: number, func: any): void;
    setXY(x: number, y: number): void;
}

export declare class SpriteDef extends ObjectDef implements IStorageOpReceiver {
    name: string;
    width: number;
    height: number;
    codeFile: CodeFileDef;
    costumes: CostumeDef[];
    onCostumeChange: AsyncEventSource<(costume: CostumeDef) => void>;
    constructor(storage: IProjectStorage, parent: IObjectDef | undefined, id: string | undefined, name: string);
    get firstCostume(): CostumeDef;
    findCostume(id: string): CostumeDef | undefined;
    static fromOp(storage: IProjectStorage, parent: IObjectDef, id: string, op: any): SpriteDef;
    processSet(op: any): void;
    processAdd(childId: string, op: any): void;
    private createUpdateOp;
    static isEqual(a: SpriteDef | undefined, b: SpriteDef | undefined): boolean;
    createSprite(args: {
        x: number;
        y: number;
    }): Sprite;
}
export declare class SpriteDefCollection {
    private _sprites;
    asArray(): SpriteDef[];
    get length(): number;
    push(sprite: SpriteDef): void;
    getByName(name: string): SpriteDef | undefined;
    getByNameOrThrow(name: string): SpriteDef;
    getById(id: string): SpriteDef | undefined;
    forEach(func: any): void;
    find(pred: (x: SpriteDef) => boolean): SpriteDef | undefined;
    map(func: (sprite: SpriteDef) => any): any[];
}

export interface ISpriteSource {
    draw(ctx: any, x: number, y: number, w: number, h: number): void;
}
export declare class SpriteImage implements ISpriteSource {
    private _w;
    private _h;
    private _image;
    constructor(name: string, w: number, h: number);
    draw(ctx: any, x: number, y: number, w: number, h: number): void;
}
export declare class DynamicImage implements ISpriteSource {
    private _drawFunc;
    constructor(func: any);
    draw(ctx: any, x: number, y: number, w: number, h: number): void;
}

export interface ILevel {
    draw(ctx: any, x: number, w: number): void;
    setEditMode(edit: boolean): void;
}
export declare enum PosKind {
    Pixel = 0,
    Grid = 1
}
export declare class Pos {
    kind: PosKind;
    x: number;
    y: number;
    constructor(kind: PosKind, x: number, y: number);
}
export declare class TileLevel implements ILevel {
    private _def;
    private _tileSprites;
    private _sprites;
    private _editMode;
    get TileLevelProps(): import("./TileLevelDef").TileLevelProps;
    constructor(def: TileLevelDef);
    setEditMode(edit: boolean): void;
    draw(ctx: any, x: number, y: number): void;
    getGridPosByPixelPos(x: number, y: number): Pos;
    private drawGrid;
}

export declare type TileLevelProps = {
    gridWidth: number;
    gridHeight: number;
    tileWidth: number;
    tileHeight: number;
};
export declare type TileDef = {
    x: number;
    y: number;
    id: string;
    viewId: number;
};
export declare class TileLevelDef extends ObjectDef implements IStorageOpReceiver {
    codeFile: CodeFileDef;
    rows: any[];
    props: TileLevelProps;
    private _tilesId;
    private _sprites;
    private _nextViewId;
    constructor(storage: IProjectStorage, parent: IObjectDef, id: string | undefined, props: TileLevelProps | undefined, sprites: SpriteDefCollection);
    static fromOp(storage: IProjectStorage, parent: IObjectDef, id: string, sprites: SpriteDefCollection, op: any): TileLevelDef;
    processSet(op: any): void;
    processAdd(childId: string, op: any): void;
    private createUpdateOp;
    setSize(gridWidth: number, gridHeight: number): void;
    setTiles(tiles: {
        sprite: SpriteDef;
        x: number;
        y: number;
    }[]): void;
    forEachTile(func: (tile: TileDef | null, sprites: SpriteDefCollection) => void): void;
    private updateTiles;
    private createSpriteRef;
}

export declare class NumberProperty {
    private _value;
    id: number;
    constructor(value: number | undefined);
    glide(delta: number, step: number): void;
    add(delta: number): void;
    get(): number;
    set(value: number): void;
}
export declare class LinearAnimator {
    prop: NumberProperty;
    delta: number;
    step: number;
    constructor(prop: NumberProperty, delta: number, step: number);
    animate(frameTime: number): boolean;
}
export declare class LinearAnimator2 {
    obj: any;
    prop: string;
    delta: number;
    step: number;
    constructor(obj: object, prop: string, delta: number, step: number);
    animate(frameTime: number): boolean;
}
export declare class LoopLinearAnimator {
    prop: NumberProperty;
    startDelta: number;
    delta: number;
    step: number;
    direction: number;
    constructor(prop: NumberProperty, delta: number, step: number);
    animate(frameTime: number): boolean;
}
export declare class DiscreteAnimator {
    prop: NumberProperty;
    values: number[];
    index: number;
    intervalMs: number;
    lastFrameTimeMs: number;
    constructor(prop: NumberProperty, values: number[], intervalSeconds: number);
    animate(frameTime: number): boolean;
}
export declare class PropertyAnimationManager {
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
export declare var animator: PropertyAnimationManager;

export declare class Game {
    private _screen;
    private _canvas;
    run(screen: Screen): void;
    loadCanvas(canvas: any): void;
    private tryRun;
}

export declare class Help {
    private _content;
    add(key: string, content: string): void;
}

export * from './help';
export * from './CostumeDef';
export * from './CodeFileDef';
export * from './ScreenDef';
export * from './TileLevelDef';
export * from './Project';
export * from './game';
export * from './Screen';
export * from './Sprite';
export * from './SpriteSource';
export * from './input';
export * from './ProjectStorage';
export * from './TileLevel';
export * from './SpriteDef';
export declare class Help2 {
    private _content;
    add(key: string, content: string): void;
}

export declare class Input {
    pressedKeys: any;
    constructor();
    private onKeyDown;
    private onKeyUp;
}
