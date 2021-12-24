import { timeStamp } from "console";
import { BlockList } from "net";
import { v4 as uuidv4 } from 'uuid';

export interface IMessageChannel {
  updateSnapshot(json: string);
  updateSprite(id: string, SpriteDef: any);
  removeSprite(id: string, obj: any);
  updateCostume(id: string, SpriteDef: any);
  removeCostume(id: string, SpriteDef: any);
  updateLevel(id: string, SpriteDef: any);
}

/**
 * ATT: all methods should be static. We will deserialize JS into this class without casting
 */
export class CodeFileDef {
  // name of code file; for sprites the same as sprite name
  public id: string;
  public name: string = 'No name';
  public code: { [key: string]: string } = {};

  public constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
  }

  // return id of the last edited block
  // useful for opening up editor
  public static getLastEditedBlockId(codeFile: CodeFileDef): string | undefined {
    for (let item in codeFile.code) {
      return item;
    }
    return undefined;
  }

  public static getCode(codeFile?: CodeFileDef, blockId?: string) {
    if (codeFile === undefined || blockId === undefined) {
      return '';
    }

    return codeFile.code[blockId];
  }

  public static updateCode(codeFile: CodeFileDef | undefined, blockId: string | undefined, code: string) {
    if (codeFile === undefined || blockId === undefined) {
      return '';
    }

    codeFile.code[blockId] = code;
  }
}

/**
 * ATT: all methods should be static. We will deserialize JS into this class without casting
 */
export class CostumeDef {
  public id: string;
  public name: string = 'No name';
  public data: string = '';

  public constructor() {
    this.id = uuidv4();
  }
}

/**
 * ATT: all methods should be static. We will deserialize JS into this class without casting
 */
export class SpriteDef {
  // unique ID of the sprite
  public id: string;
  // user defined name of the sprite
  public name: string = 'No name';
  public width: number = 0;
  public height: number = 0;
  public codeFile: CodeFileDef;
  public costumes: CostumeDef[] = [];

  public constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
    this.codeFile = new CodeFileDef(name);

    // add one costume by default
    this.costumes.push(new CostumeDef());
    this.costumes.push(new CostumeDef());
  }
}

/**
 * ATT: all methods should be static. We will deserialize JS into this class without casting
 */
export class TileLevelDef {
  public gridWidth: number = 0;
  public gridHeight: number = 0;
  public cells: any[] = [];
  public codeFile: CodeFileDef;

  public constructor() {
    this.codeFile = new CodeFileDef('level');
  }
}

/**
 * ATT: all methods should be static. We will deserialize JS into this class without casting
 */
export class ProjectDef {
  public sprites: SpriteDef[] = [];
  public level?: TileLevelDef;
  public codeFile: CodeFileDef = new CodeFileDef('game');

  public constructor() {
    // create a default sprite
    this.sprites.push(new SpriteDef('Leia'));
    this.sprites.push(new SpriteDef('Floor'));
    this.sprites.push(new SpriteDef('Air'));
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
    def.codeFile.code['updateScene'] = '// put code to update scene here';

    def.level = new TileLevelDef();
    def.level.gridWidth = 48;
    def.level.gridHeight = 8;

    return new Project(def);
  }

  public createSprite(name: string) {
    let sprite = new SpriteDef(name);

    sprite.codeFile['timer'] = '// add animation code here';
    this.def.sprites.push(sprite);
  }

  // update model by applying function
  public update(func: () => void) {
    func();
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

  public findCodeFile(file: string): CodeFileDef | undefined {
    if (this.def.codeFile.name === file) {
      return this.def.codeFile;
    }

    if (this.def.level !== undefined && this.def.level.codeFile.name === file) {
      return this.def.level.codeFile;
    }

    for (let spriteKey in this.def.sprites) {
      let sprite = this.def.sprites[spriteKey];
      if (sprite.codeFile.name === file) {
        return sprite.codeFile;
      }
    }

    return undefined;
  }

  public findSprite(id: string): SpriteDef | undefined {
    for (let spriteKey in this.def.sprites) {
      let sprite = this.def.sprites[spriteKey];
      if (sprite.id === id) {
        return sprite;
      }
    }

    return undefined;
  }
}

let project = Project.createEmptyProject();
export { project };