import { v4 as uuidv4 } from 'uuid';
import { x64Hash64 } from './hash/murmurhash3';
import AsyncEventSource from './AsyncEventSource';
import { IProjectStorage, ProjectLocalStorage } from './ProjectStorage';

export interface IObjectDef {
  get path(): string;
}

export class ObjectDef implements IObjectDef {
  public id: string;
  public parent: IObjectDef | undefined;
  protected _storage: IProjectStorage;

  public constructor(storage: IProjectStorage, parent: IObjectDef | undefined) {
    this.id = uuidv4();
    this.parent = parent;
    this._storage = storage;
  }

  public get path(): string {
    if (this.parent !== undefined) {
      return this.parent.path + '!' + this.id;
    } else {
      return this.id;
    }
  }
}

export class CodeBlockDef extends ObjectDef {
  public name: string;
  public code: string;
  public codeId: string;

  public constructor(storage: IProjectStorage, parent: IObjectDef, name: string, code: string) {
    super(storage, parent);
    this.name = name;
    this.code = code;
    this.codeId = x64Hash64(code);
    storage.updateItem(this.path, this.createUpdateOp());
  }

  public updateCode(code: string) {
    this.code = code;
    this.codeId = x64Hash64(code);

    this._storage.updateItem(this.path, this.createUpdateOp());
  }

  private createUpdateOp() {
    return {
      target: 'CodeBlock',
      name: this.name,
      code: this.code,
      codeId: this.codeId
    }
  }

  public populateCommands(commands: any[]) {
    commands.push(this.createUpdateOp());
  }
}

export class CodeFileDef extends ObjectDef {
  // name of code file; for sprites the same as sprite name
  public name: string = 'No name';
  public codeBlocks: CodeBlockDef[] = [];

  public constructor(storage: IProjectStorage, parent: IObjectDef | undefined, name: string) {
    super(storage, parent);
    this.name = name;
    storage.updateItem(this.path, this.createUpdateOp());
  }

  public createBlock(name: string, code: string) {
    this.codeBlocks.push(new CodeBlockDef(this._storage, this, name, code));
  }

  public get firstBlock(): CodeBlockDef | undefined { return (this.codeBlocks.length > 0) ? this.codeBlocks[0] : undefined }

  private createUpdateOp(): any {
    return {
      target: 'CodeFile',
      name: this.name,
      codeBlockCount: this.codeBlocks.length
    }
  }
  public populateCommands(commands: any[]) {
    commands.push(this.createUpdateOp());

    this.codeBlocks.forEach((x) => x.populateCommands(commands));
  }
}

export enum ImageFormat {
  svg,
  png
}

export class ImageData {
  public readonly image: string | undefined = undefined;
  public readonly imageFormat: ImageFormat = ImageFormat.svg;
  public readonly imageId: string | undefined = undefined;

  public constructor(imageFormat: ImageFormat, image: string) {
    this.imageFormat = imageFormat;
    this.image = image;
    this.imageId = x64Hash64(image);
  }

  public static isEqual(a: ImageData | undefined, b: ImageData | undefined): boolean {
    if (a === undefined && b === undefined) {
      return true;
    } else if (a === undefined || b === undefined) {
      return false;
    } else {
      // @ts-ignore
      return a.imageId === b.imageId;
    }
  }
}

/**
 * ATT: all methods should be static. We will deserialize JS into this class without casting
 */
export class CostumeDef extends ObjectDef {
  public name: string = 'No name';
  public imageData: ImageData | undefined;

  public constructor(storage: IProjectStorage, parent: IObjectDef) {
    super(storage, parent);
    this.id = uuidv4();
    storage.updateItem(this.path, this.createUpdateOp());
  }

  public updateImage(imageData: ImageData) {
    this.imageData = imageData;

    let sprite = this.parent as SpriteDef;
    if (sprite !== undefined) {
      sprite.onCostumeChange.invoke(this);
    }

    this._storage.updateItem(this.path, this.createUpdateOp());
  }

  private createUpdateOp() {
    return {
      target: 'Costume',
      name: this.name,
      image: this.imageData?.image,
      imageFormat: this.imageData?.imageFormat,
      imageId: this.imageData?.imageId
    }
  }
  public populateCommands(commands: any[]) {
    commands.push(this.createUpdateOp());
  }
}

/**
 * ATT: all methods should be static. We will deserialize JS into this class without casting
 */
export class SpriteDef extends ObjectDef {
  // user defined name of the sprite
  public name: string = 'No name';
  public width: number = 0;
  public height: number = 0;
  public codeFile: CodeFileDef;
  public costumes: CostumeDef[] = [];

  /**
   * called when costume changes
   */
  public onCostumeChange = new AsyncEventSource<(costume: CostumeDef) => void>();

  public constructor(storage: IProjectStorage, parent: IObjectDef | undefined, name: string) {
    super(storage, parent);
    this.name = name;
    this.codeFile = new CodeFileDef(storage, this, name);

    storage.updateItem(this.path, this.createUpdateOp());

    // add one costume by default
    this.costumes.push(new CostumeDef(storage, this));
    this.costumes.push(new CostumeDef(storage, this));
  }

  public get firstCostume(): CostumeDef { return this.costumes[0] }

  public findCostume(id: string): CostumeDef | undefined {
    for (let i = 0; i < this.costumes.length; i++) {
      if (this.costumes[i].id == id) {
        return this.costumes[i];
      }
    }

    return undefined;
  }

  private createUpdateOp() {
    return {
      target: 'Sprite',
      name: this.name,
      width: this.width,
      height: this.height,
      costumeCount: this.costumes.length
    }
  }

  public populateCommands(commands: any[]) {
    commands.push(this.createUpdateOp());

    this.codeFile.populateCommands(commands);
    this.costumes.forEach((x) => x.populateCommands(commands));
  }

  public static isEqual(a: SpriteDef | undefined, b: SpriteDef | undefined): boolean {
    if (a === undefined && b === undefined) {
      return true;
    } else if (a === undefined || b === undefined) {
      return false;
    } else {
      return a === b;
    }
  }
}

/**
 * ATT: all methods should be static. We will deserialize JS into this class without casting
 */
export class TileLevelDef extends ObjectDef {
  public gridWidth: number = 0;
  public gridHeight: number = 0;
  public cells: any[] = [];
  public codeFile: CodeFileDef;

  public constructor(storage: IProjectStorage) {
    super(storage, undefined)
    this.codeFile = new CodeFileDef(storage, this, 'level');
  }
}

/**
 * ATT: all methods should be static. We will deserialize JS into this class without casting
 */
export class ProjectDef {
  public sprites: SpriteDef[] = [];
  public level?: TileLevelDef;
  public codeFile: CodeFileDef;
  private _storage: IProjectStorage;

  public constructor(storage: IProjectStorage) {
    this._storage = storage;

    storage.updateItem('project', this.createUpdateOp());

    this.codeFile = new CodeFileDef(this._storage, undefined, 'game');

    // create a default sprite
    this.sprites.push(new SpriteDef(storage, undefined, 'Leia'));
    this.sprites.push(new SpriteDef(storage, undefined, 'Floor'));
    this.sprites.push(new SpriteDef(storage, undefined, 'Air'));
  }

  private createUpdateOp() {
    return {
      target: 'Project',
      spriteCount: this.sprites.length
    }
  }

  public populateCommands(commands: any[]) {
    commands.push(this.createUpdateOp());

    this.codeFile.populateCommands(commands);
    this.sprites.forEach((x) => x.populateCommands(commands));
  }
}



/**
 * utility method for managing project
 */
export class Project {
  public readonly def: ProjectDef;
  public readonly _storage: ProjectLocalStorage;

  public get storage(): IProjectStorage { return this._storage; }

  public constructor(storage: ProjectLocalStorage, def: ProjectDef) {
    this._storage = storage;
    this.def = def;
  }

  public static createEmptyProject(): Project {
    let storage = new ProjectLocalStorage();

    let def = new ProjectDef(storage);
    def.codeFile.createBlock('updateScene', '// put code to update scene here');

    def.level = new TileLevelDef(storage);
    def.level.gridWidth = 48;
    def.level.gridHeight = 8;

    return new Project(storage, def);
  }

  public forEachSprite(func: (file: SpriteDef) => void) {
    this.def.sprites.forEach((x) => func(x));
  }

  public forEachCodeFile(func: (file: CodeFileDef) => void) {
    func(this.def.codeFile);
    if (this.def.level !== undefined) {
      func(this.def.level?.codeFile);
    }
    this.def.sprites.forEach((x) => func(x.codeFile));
  }

  public findCodeFileById(id: string): CodeFileDef | undefined {
    if (this.def.codeFile.id === id) {
      return this.def.codeFile;
    }

    if (this.def.level !== undefined && this.def.level.codeFile.id === id) {
      return this.def.level.codeFile;
    }

    for (let spriteKey in this.def.sprites) {
      let sprite = this.def.sprites[spriteKey];
      if (sprite.codeFile.id === id) {
        return sprite.codeFile;
      }
    }

    return undefined;
  }

  public findSpriteById(id: string): SpriteDef | undefined {
    for (let spriteKey in this.def.sprites) {
      let sprite = this.def.sprites[spriteKey];
      if (sprite.id === id) {
        return sprite;
      }
    }

    return undefined;
  }

  public toJson(): string {
    let commands = [];
    this.def.populateCommands(commands);
    return JSON.stringify(commands);
  }
}

let project = Project.createEmptyProject();
export { project };