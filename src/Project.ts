import { timeStamp } from "console";
import { BlockList } from "net";

export class CodeFileDef {
  // name of code file; for sprites the same as sprite name
  public name: string = '';
  public code: { [key: string]: string } = {};

  public constructor(name: string) {
    this.name = name;
  }

  // return id of the last edited block
  // useful for opening up editor
  public getLastEditedBlockId(): string | undefined {
    for (let item in this.code) {
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

export class SpriteDef {
  // unique ID of the sprite
  public id: string = '';
  // user defined name of the sprite
  public name: string = '';
  public width: number = 0;
  public height: number = 0;
  public codeFile: CodeFileDef;
  public skins: string[] = [];

  public constructor(name: string) {
    this.name = name;
    this.codeFile = new CodeFileDef(name);
  }
}

export class TileLevelDef {
  public gridWidth: number = 0;
  public gridHeight: number = 0;
  public cells: any[] = [];
  public codeFile: CodeFileDef;

  public constructor() {
    this.codeFile = new CodeFileDef('level');
  }
}

export class ProjectDef {
  public sprites: SpriteDef[] = [];
  public level?: TileLevelDef;
  public codeFile: CodeFileDef = new CodeFileDef('game');
}

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

  public createSprite(id: string, name: string) {
    let sprite = new SpriteDef(name);

    sprite.codeFile['timer'] = '// add animation code here';
    this.def.sprites.push(sprite);
  }

  // update model by applying function
  public update(func: () => void) {
    func();
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
}

let project = Project.createEmptyProject();
export { project };