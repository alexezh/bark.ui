export class CodeFileDef {
  // name of code file; for sprites the same as sprite name
  public name: string = '';
  public code: { [key: string]: string } = {};

  public constructor(name: string) {
    this.name = name;
  }

  public getBlock(id: string): string {
    return this.code[id];
  }
}

export class SpriteDef {
  // unique ID of the sprite
  public id: string = '';
  // user defined name of the sprite
  public name: string = '';
  public width: number = 0;
  public height: number = 0;
  public code: CodeFileDef;
  public skins: string[] = [];

  public constructor(name: string) {
    this.name = name;
    this.code = new CodeFileDef(name);
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

    return new Project(def);
  }

  public createSprite(id: string, name: string) {
    let sprite = new SpriteDef(name);

    sprite.code['timer'] = '// add animation code here';
    this.def.sprites.push(sprite);
  }

  // update model by applying function
  public update(func: () => void) {
    func();
  }
}

let project = Project.createEmptyProject();
export { project };