// This is a template for which specific stores will inherit from
// A store keeps track of the state of the application, as well as provides state information to the dispatcher
export class Store {
    constructor(dispatcher) {
        this._listeners = [];
        // Set this state to the initial state for the Store
        // Because this is a template for specific stores, the getInitialState method shouldn't do much here
        this._state = this.getInitialState();
        // Here we'll register the store's onDispatch method with our dispatcher. 
        // Because this is a template for specific stores, the onDispatch method shouldn't do much here
        dispatcher.register(this._onDispatch.bind(this));
    }

    _onDispatch() {
        // Because this is a template for specific stores, we expect this to be overridden by specific sub-stores
        // So we'll simply throw an error telling the user this, if the primary Store's _onDispatch method is called
        throw new Error('"Store._onDispatch": Substores must override _onDispatch method of a Flux Store');
    }

    getInitialState() {
        // Because this is a template for specific stores, we expect this to be overridden by specific sub-stores
        // So we'll simply throw an error telling the user this, if the primary Store's getInitialState method is called
        throw new Error('"Store.getInitialState": Substores must override getInitialState method of a Flux Store')
    }

    addListener(listener) {
        // The purpose and function of this method is similar to the dispatcher's register function
        this._listeners.push(listener);
    }

    // We have this internal emit change method to call whenever something inside the Store has changed
    // Thereby notifying the listeners of the change
    _emitChange() {
        // It does this by calling each listener it knows about while passing the state to them
        this._listeners.forEach(listener => listener(this._state));
    }
}