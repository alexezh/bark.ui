
//WeakRef();
export class StateStore {
  public readonly state: {} = {};

  private _callbacks: { [key: string]: any } = {};

  public constructor(state: {}) {
    this.state = state;
  }

  public registerStateChange(name: string, onChange: any) {
    this._callbacks[name] = new WeakRef<any>(onChange);
  }

  public unregisterStateChange(name: string) {
    delete this._callbacks[name];
  }

  public setState(state: {}) {
    for (let key in state) {
      this.state[key] = state[key];
    }

    // run outside current callstack
    setTimeout(() => {
      for (let key in this._callbacks) {
        let weakOnChange = this._callbacks[key];
        let onChange = weakOnChange.deref();
        if (onChange) {
          onChange();
        } else {
          delete this._callbacks[key];
        }
      }
    }, 0);
  }
}