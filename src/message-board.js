// Bring in the method to create a store in redux
import { createStore } from "redux";
// Set constants for userStatus
export const ONLINE = 'ONLINE';
export const AWAY = 'AWAY';
export const BUSY = 'BUSY';
export const OFFLINE = 'OFFLINE';
// Set constants for actions
export const UPDATE_STATUS = 'UPDATE_STATUS';
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

// Create a reducer for our actions. As usual, a reducer takes a state and an action
const reducer = (state = defaultState, { type, value }) => {
    // Switch based on action type
    switch (type) {
        case UPDATE_STATUS:
            // For updating the user's status, we'll just return a copy of the state with the updated userStatus value
            return { ...state, userStatus: value };
    }
    return state;
};

// Create a redux store for the messaging functionality. The createStore method takes a reducer as a parameter
const store = createStore(reducer);

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