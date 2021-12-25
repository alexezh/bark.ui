import { BlockList } from "net";
import { v4 as uuidv4 } from 'uuid';
import { x64Hash64 } from './hash/murmurhash3';
import AsyncEventSource from './AsyncEventSource';

export interface IMessageChannel {
  updateSnapshot(json: string);
  updateSprite(id: string, SpriteDef: any);
  removeSprite(id: string, obj: any);
  updateCostume(id: string, SpriteDef: any);
  removeCostume(id: string, SpriteDef: any);
  updateLevel(id: string, SpriteDef: any);
}

export interface IObjectDef {
  get path(): string;
}

export class ObjectDef implements IObjectDef {
  public id: string;
  public parent: IObjectDef | undefined;

  public constructor(parent: IObjectDef | undefined) {
    this.id = uuidv4();
    this.parent = parent;
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

  public constructor(parent: IObjectDef, name: string, code: string) {
    super(parent);
    this.name = name;
    this.code = code;
    this.codeId = x64Hash64(code);
  }

  public updateCode(code: string) {
    this.code = code;
    this.codeId = x64Hash64(code);
  }

  public populateCommands(commands: any[]) {
    commands.push({
      op: 'addCodeBlock',
      name: this.name,
      code: this.code,
      codeId: this.codeId
    });
  }
}

export class CodeFileDef extends ObjectDef {
  // name of code file; for sprites the same as sprite name
  public name: string = 'No name';
  public codeBlocks: CodeBlockDef[] = [];

  public constructor(parent: IObjectDef | undefined, name: string) {
    super(parent);
    this.name = name;
  }

  public createBlock(name: string, code: string) {
    this.codeBlocks.push(new CodeBlockDef(this, name, code));
  }

  public get firstBlock(): CodeBlockDef | undefined { return (this.codeBlocks.length > 0) ? this.codeBlocks[0] : undefined }

  public populateCommands(commands: any[]) {
    commands.push({
      op: 'addCodeFile',
      name: this.name,
      codeBlockCount: this.codeBlocks.length
    });

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

  public constructor(parent: IObjectDef) {
    super(parent);
    this.id = uuidv4();
  }

  public updateImage(imageData: ImageData) {
    this.imageData = imageData;

    let sprite = this.parent as SpriteDef;
    if (sprite !== undefined) {
      sprite.onCostumeChange.invoke(this);
    }
  }

  public populateCommands(commands: any[]) {
    commands.push({
      op: 'addCostume',
      name: this.name,
      image: this.imageData?.image,
      imageFormat: this.imageData?.imageFormat,
      imageId: this.imageData?.imageId
    });
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

  public constructor(parent: IObjectDef | undefined, name: string) {
    super(parent);
    this.name = name;
    this.codeFile = new CodeFileDef(this, name);

    // add one costume by default
    this.costumes.push(new CostumeDef(this));
    this.costumes.push(new CostumeDef(this));
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

  public populateCommands(commands: any[]) {
    commands.push({
      op: 'addSprite',
      name: this.name,
      width: this.width,
      height: this.height,
      costumeCount: this.costumes.length
    });

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

  public constructor() {
    super(undefined)
    this.codeFile = new CodeFileDef(this, 'level');
  }
}

/**
 * ATT: all methods should be static. We will deserialize JS into this class without casting
 */
export class ProjectDef {
  public sprites: SpriteDef[] = [];
  public level?: TileLevelDef;
  public codeFile: CodeFileDef = new CodeFileDef(undefined, 'game');

  public constructor() {
    // create a default sprite
    this.sprites.push(new SpriteDef(undefined, 'Leia'));
    this.sprites.push(new SpriteDef(undefined, 'Floor'));
    this.sprites.push(new SpriteDef(undefined, 'Air'));
  }

  public populateCommands(commands: any[]) {
    commands.push({
      op: 'updateProject',
      spriteCount: this.sprites.length
    });

    this.codeFile.populateCommands(commands);
    this.sprites.forEach((x) => x.populateCommands(commands));
  }
}

/**
 * utility method for managing project
 */
export class Project {
  public readonly def: ProjectDef;

  public constructor(def: ProjectDef) {
    this.def = def;
  }

  public static createEmptyProject(): Project {
    let def = new ProjectDef();
    def.codeFile.createBlock('updateScene', '// put code to update scene here');

    def.level = new TileLevelDef();
    def.level.gridWidth = 48;
    def.level.gridHeight = 8;

    return new Project(def);
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