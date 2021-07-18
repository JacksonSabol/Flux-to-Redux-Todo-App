import { Dispatcher, Store } from "./flux";
// Create a new instance of the dispatcher
const controlPanelDispatcher = new Dispatcher();

// Grab reference to the username input field and add an event listener for changes to dispatch
document.getElementById('userNameInput').addEventListener('input', ({target}) => {
    const name = target.value;
    console.log('Dispatching: ', name);
    // We don't have any actions yet, so we'll just pass a string to the dispatcher
    controlPanelDispatcher.dispatch('TODO_NAME_INPUT_ACTION');
});
// Grab reference to each input tag with a name of fontSize, that are children to a form
document.forms.fontSizeForm.fontSize.forEach(element => {
    // Add an event listener to each input tag
    element.addEventListener('change', ({target}) => {
        console.info('Dispatching action for font size change... Setting font size to:', target.value)
        // Ignoring the target for now, we'll just dispact a placeholder action for updating the font size
        controlPanelDispatcher.dispatch('TODO_FONT_SIZE_CHANGE');
    });
});

// Now we will define a new store type for holding user preferences, like font size and username
class UserPrefsStore extends Store {
    // Remember that we have to define getInitialState and _onDispatch for specific stores, to override the empty methods of the template store
    getInitialState() {
        // This method will just return the default values for the intial load
        // We'll just use the hardcoded values from the index.html file
        return {
            username: 'Jim',
            fontSize: 'small'
        };
    }

    _onDispatch(action) {
        // Since our actions aren't set up yet, we'll just log some info
        console.log('Store received dispatch: ', action);
        // Then we want to let our listeners know that something has been dispatched, so we emit the change
        this._emitChange()
    }

    // Finally, we'll add something new that's not part of the base store: 
    getUserPrefs() {
        // Stores do not change the state, as state is immutable, but we can get a copy of the state
        // So we'll just return the current state
        return this._state;
    }
}

// Now we initialize the store
const usersPrefsStore = new UserPrefsStore(controlPanelDispatcher);

// Test the store by adding a listener (similar to registering an action with the dispatcher)
usersPrefsStore.addListener((state) => {
    // the listener can just log the current state for now
    console.info('The current state is: ', state);
})

// Registering the action with the dispatcher of logging the action name
controlPanelDispatcher.register(action => {
    console.info('Received action: ', action);
});