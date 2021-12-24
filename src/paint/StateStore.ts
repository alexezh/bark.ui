
/**
 * stores properties of the interface
 * provides notification mechanism for propety changes
 * 
 * in other words, it provides 90% of redux functionality without reducers
 * instead we say that store maintains state which code can update and listen
 * state is mutable; it is responsibility of component to remember the last value(s)
 */
export class StateStore<T> {
  public readonly state: {} = {};

  private _callbacks: { [key: string]: any } = {};

  public constructor(state: T) {
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
