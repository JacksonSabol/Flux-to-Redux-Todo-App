import { Dispatcher, Store } from "./flux";
// Create a new instance of the dispatcher
const controlPanelDispatcher = new Dispatcher();

// Actions describe the changes that we want to make in a consistent format for consumption, they don't actually make the change
// Define the action type for updating a username (can also use key mirror for large sets of actions)
const UPDATE_USERNAME = 'UPDATE_USERNAME';
// Action to describe an update to a username 
const usernameUpdateAction = (name) => {
    // We'll just return an object with a type to describe the action, and the value we want to update with the action
    return {
        type: UPDATE_USERNAME,
        value: name
    }
}

// Now we'll do the same for font size preference
const UPDATE_FONT_SIZE = 'UPDATE_FONT_SIZE';
const fontSizeUpdateAction = (size) => {
    // We'll just return an object with a type to describe the action, and the value we want to update with the action
    return {
        type: UPDATE_FONT_SIZE,
        value: size
    }
}

// Grab reference to the username input field and add an event listener for changes to dispatch
document.getElementById('userNameInput').addEventListener('input', ({ target }) => {
    const name = target.value;
    console.log('Dispatching: ', name);
    // Now we have an action defined to describe this change to username, so we'll use that
    controlPanelDispatcher.dispatch(usernameUpdateAction(name));
});
// Grab reference to each input tag with a name of fontSize, that are children to a form
document.forms.fontSizeForm.fontSize.forEach(element => {
    // Add an event listener to each input tag
    element.addEventListener('change', ({ target }) => {
        console.info('Dispatching action for font size change... Setting font size to:', target.value)
        // Now we have an action defined to describe this change to the font size, so we'll use that
        controlPanelDispatcher.dispatch(fontSizeUpdateAction(target.value));
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
        // Now that we have actions described, we can perform some conditional logic to dispatch the appropriate action
        switch (action.type) {
            case UPDATE_USERNAME:
                // With action type UPDATE_USERNAME, we want to update the username that's "stored" in the state of this store
                this._state.username = action.value;
                // Then we want to emit the change to let our listeners know the state has been updated
                this._emitChange()
                break;
            case UPDATE_FONT_SIZE:
                // For updating the font size preference, we'll do functionally the same thing as for the username
                this._state.fontSize = action.value;
                // Then emit the change of course to let our listeners know the state has been updated
                this._emitChange();
                break;

        }
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
    // Now that we have actions described, and our store updating its state depending on the action type, we can reflect those changes on the page
    // We'll use a helper function called render() that takes in our state
    render(state);
});

// Helper function to render changes in state to the page, by updating the HTML
const render = ({ username, fontSize }) => {
    // All we'll do here is update the DOM directly using JavaScript
    // Update the inner text of the username span
    document.getElementById('userName').innerText = username;
    // Update the font size for the primary elements on the page inside the container section
    document.getElementsByClassName('container')[0].style.fontSize = fontSize === 'small' ? '16px' : '24px';
    // Update the fontSize named input elements to change the size of the radio buttons
    document.forms.fontSizeForm.fontSize.value = fontSize;

};

// Registering the action with the dispatcher of logging the action name
controlPanelDispatcher.register(action => {
    console.info('Received action: ', action);
});