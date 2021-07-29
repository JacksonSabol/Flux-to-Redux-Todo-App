// Bring in the method to create a store in redux
import { createStore } from "redux";
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
    userStatus: 'ONLINE'
};

// Create a redux store for the messaging functionality. The createStore method takes a reducer as a parameter, which we don't have yet
// so we'll just pass a simple function that initializes the default state if no state exists yet
const store = createStore((state = defaultState) => {
    // For now, simply return the state
    return state;
});

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
}

// Call the render function to display the messages
render();