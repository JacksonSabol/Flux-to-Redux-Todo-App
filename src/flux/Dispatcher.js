export class Dispatcher {
    constructor() {
        this._listeners = [];
    }
    // the _listeners property is just a list of functions that we'd like to call for an action
    dispatch(action) {
        this._listeners.forEach(listener => listener(action));
    }
    // Registering a listener is simply pushing it into the array (list) of listeners
    register(listener) {
        this._listeners.push(listener);
    }
}