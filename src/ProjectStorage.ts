import AsyncEventSource from './AsyncEventSource';

export enum StorageOpKind {
  update = 'update',
  remove = 'remove',
}

export class StorageOp {
  public readonly kind: StorageOpKind;
  public readonly id: string;
  public readonly value: any;

  public constructor(kind: StorageOpKind, id: string, value: any = null) {
    this.kind = kind;
    this.id = id;
    this.value = value;
  }
}

export interface IProjectStorage {
  updateSnapshot(json: string);
  updateItem(id: string, value: any);
  removeItem(id: string);

  registerOnChange(func: (op: StorageOp[]) => void);
  unregisterOnChange(func: (op: StorageOp[]) => void);
}

export class ProjectLocalStorage implements IProjectStorage {
  private _data: { [key: string]: any } = {};
  private _onChange: AsyncEventSource<(costume: StorageOp[]) => void> = new AsyncEventSource<(costume: StorageOp[]) => void>();
  private _changeQueue: StorageOp[] = [];
  private _updatePending: boolean = false;

  public constructor() {
    this.onInvokeComplete = this.onInvokeComplete.bind(this);
  }

  public updateSnapshot(json: string) {
    throw new Error("Method not implemented.");
  }
  public updateItem(id: string, value: any) {
    this._data[id] = value;
    this.queueChange(new StorageOp(StorageOpKind.update, id, value));
  }
  public removeItem(id: string) {
    delete this._data[id];
    this.queueChange(new StorageOp(StorageOpKind.remove, id));
  }

  private queueChange(op: StorageOp) {
    this._changeQueue.push(op);
    if (!this._updatePending) {
      this._updatePending = true;
      this._onChange.invokeWithCompletion(this.onInvokeComplete, this._changeQueue);
      this._changeQueue = [];
    }
  }

  private onInvokeComplete() {
    this._updatePending = false;
    if (this._changeQueue.length === 0) {
      return;
    }

    this._updatePending = true;
    this._onChange.invokeWithCompletion(this.onInvokeComplete, this._changeQueue);
    this._changeQueue = [];
  }

  public registerOnChange(func: (op: StorageOp[]) => void) {
    this._onChange.add(func);
  }

  public unregisterOnChange(func: (op: StorageOp[]) => void) {
    this._onChange.remove(func);
  }
}
