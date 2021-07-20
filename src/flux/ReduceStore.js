import { Store } from ".";
export class ReduceStore extends Store {
    constructor(dispatcher) {
        // Call the constructor of the superior class, Store, to inherit its properties
        super(dispatcher);
    }
    // This "placeholder" method is to take an action and transform/reduce a state with it
    reduce(state, action) {
        // Because this is a template for specific ReduceStores, we expect this to be overwritten by specific sub-ReduceStores
        // So we'll simply throw an error telling the user this, if the primary ReduceStore's reduce method is called
        throw new Error('"ReduceStore.reduce": Substores must override reduce method of a Flux ReduceStore');
    }
    // Similar to creating specific sub-stores through extension of a Store, we want to overwrite the _onDispatch method of Store
    _onDispatch(action) {
        // In the pursuit of immutability of data, we want to create a new state without mutating the old state
        // So we can grab the current state and "reduce" it, using the current state and the provided action
        const newState = reduce(this._state, action);
        // Check if the action dispatched described and resulted in any changes 
        if(newState !== this._state) {
            // If it did, we want to update the value of the state
            this._state = newState;
            // Then we emit the changes to notify any listeners "automatically" that the state has been updated
            this._emitChange();
            // Otherwise there's nothing to do
        }
    }
}