// Bring in the method to create a store in redux, as well as to combine reducers
import { createStore, combineReducers } from "redux";
// Set constants for userStatus
export const ONLINE = 'ONLINE';
export const AWAY = 'AWAY';
export const BUSY = 'BUSY';
export const OFFLINE = 'OFFLINE';
// Set constants for actions
export const UPDATE_STATUS = 'UPDATE_STATUS';
export const CREATE_NEW_MESSAGE = 'CREATE_NEW_MESSAGE';
// Set a default state to load into the store
const defaultState = {
    // Add some dummy messages
    messages: [
        {
            date: new Date(Date.now()).getMinutes() - 1,
            postedBy: 'Cron',
            content: 'Still a better user experience than Jira.'
        },
        {
            date: new Date(Date.now()).getMinutes() - 2,
            postedBy: 'Ricky',
            content: 'Did you run the commit linter, Zito?'
        },
        {
            date: new Date(Date.now()).getMinutes() - 3,
            postedBy: 'Zito',
            content: 'It\'s a part of the pre-commit hook, Ricky.'
        }
    ],
    userStatus: ONLINE
};

// To minimize our footprint, we can create reducers that act on smaller pieces of the state at one time
// So this reducer is to only update the user's status
const userStatusReducer = (state = defaultState.userStatus, { type, value }) => {
    // Switch based on user status action type
    switch (type) {
        case UPDATE_STATUS:
            // For updating the user's status, we now only need to return the value, not the entire state object
            return value;
    }
    // Still return the state if the switch statement finds no matches
    return state;
};

// Define a message reducer
const messageReducer = (state = defaultState.messages, { type, value, postedBy, date} ) => {
    switch(type) {
        case CREATE_NEW_MESSAGE:
            // Since the messages property of our state is an array, it is a mutable datatype
            // So we create a copy of it while adding our new message into the new state
            const newState = [
                {
                    date,
                    content: value,
                    postedBy
                },
                ...state
            ]
            return newState;
    }
    // Still return the state if the switch statement finds no matches
    return state;
};

// Now that we have 2 reducers for 2 actions, we need to combine them so the store still receives a single reducer
const combinedReducer = combineReducers({
    // combineReducers takes an object whose values correspond to different reducers
    // The keys in the object are the properties of the state to be updated corresponding to each reducer
    userStatus: userStatusReducer,
    messages: messageReducer
})

// Create a redux store for the messaging functionality. The createStore method takes the combined reducer as a parameter
const store = createStore(combinedReducer);

// Finally, create a render function to render our messages from the store
const render = () => {
    // First we get a copy of the state, or at least the part of it we care about
    const { messages, userStatus } = store.getState();
    // Then we'll update the HTML inside the well section for messages
    document.getElementById('messages').innerHTML = messages
        // sort the messages by post date
        .sort((msgA, msgB) => msgB.date - msgA.date)
        // map the sorted messages to an inline message HTML component
        .map(message => (
            `
            <div>
                ${message.postedBy}: ${message.content}
            </div>
            `
        ))
        // join the map to create a string of HTML
        .join('');
    // Now that we have a reducer for updating the userStatus, we can update it on the DOM
    // The only change we want is to disable the submission of new messages when the userStatus is set to OFFLINE
    document.forms.newMessage.fields.disabled = (userStatus === OFFLINE);
}

// Actions describe the changes that we want to make in a consistent format for consumption, they don't actually make the change
// Define the action type for updating a userStatus
const statusUpdateAction = (value) => {
    return {
        // Could throw an error here if the value doesn't match our predefined user statuses in the future
        type: UPDATE_STATUS,
        value
    }
};
// Define the action type for adding a new message, which has content and an author
const newMessageAction = (content, postedBy) => {
    // We also need the date/time when the message was posted, but we can just set that here
    const date = new Date();
    return {
        // Could throw an error here if the value doesn't match our predefined user statuses in the future
        type: CREATE_NEW_MESSAGE,
        value: content,
        postedBy,
        date
    }
}

// Now that we have a reducer operating on the store, a render function operating on the DOM, and an action generator
// we can set up a listener for changes to the userStatus option dropdown, and dispatch those changes accordingly
document.forms.selectStatus.status.addEventListener('change', (e) => {
    // Dispatch the statusUpdateAction with the value of the event's target
    // Versus Flux, we don't have to create a dispatcher, it's built into the store of redux
    store.dispatch(statusUpdateAction(e.target.value))
});
// Call the render function to display the messages
render();

// Lastly, we need to subscribe to the store, which is similar to the Flux dispatcher.register function, which registers listener functions
// Whatever function is registered/subscribed to changes with the store will run any time the store changes
// So naturally we want to pass the render() function here, so that the DOM is updated appropriately
store.subscribe(render);