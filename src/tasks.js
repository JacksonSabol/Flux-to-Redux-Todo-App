// Library to quickly generate unique IDs
import { generate as id } from 'shortid';
import { Dispatcher, ReduceStore } from './flux';

// Create a tasks/todos specific dispatcher instance
const tasksDispatcher = new Dispatcher();

// Define Task action names
const CREATE_TASK = `CREATE_TASK`;
const SHOW_TASKS = `SHOW_TASKS`;
const COMPLETE_TASK = `COMPLETE_TASK`;

// Define an action creator for our CREATE_TASK action
const createNewTaskAction = (content) => {
    // This action creator just returns an object with a type to describe the action, and the value we want to update with the action
    // Which in this case, is the CREATE_TASK action where the value is the content of a ToDo item
    return {
        type: CREATE_TASK,
        value: content
    }
}

// Define an action creator for showing tasks actions
const showTaskAction = (show) => {
    // Similar to creating a new task action, we'll just return an object with a type to describe the action, and the value we want to update with the action
    // Which is the SHOW_TASKS action description, with the value equal to the boolean 'show'
    return {
        type: SHOW_TASKS,
        value: show
    }
}

// Define an action creator for completing tasks actions
const completeTaskAction = (id, isComplete) => {
    // Somewhat different than creating a new task action, we want to know which task should be completed
    // So we return an action with type and value, but also the id of the task to complete
    return {
        type: COMPLETE_TASK,
        id: id,
        value: isComplete
    }
}

// Create a TasksStore by extending our ReduceStore
class TasksStore extends ReduceStore {
    // We want to overwrite the getInitialState method to provide a default state for the TasksStore
    getInitialState() {
        // For now, the default state can just be an object with an array of tasks on the tasks property
        return {
            // Populate the default initial state with some dummy values
            tasks: [
                {
                    id: id(),
                    content: "Update CSS styles",
                    complete: false
                },
                {
                    id: id(),
                    content: "Add unit tests",
                    complete: false
                },
                {
                    id: id(),
                    content: "Implement Undo functionality",
                    complete: false
                },
                {
                    id: id(),
                    content: "Setup PiHole",
                    complete: true
                }
            ],
            // We also want to be able to toggle a 'view' where only incomplete items are displayed
            // For that we'll add a boolean property to keep track of whether or not to show completed items
            showCompletedItems: true
        }
    }
    // Similar to creating specific sub-stores through extension of a Store, we want to overwrite the reduce method of ReduceStore
    reduce(state, action) {
        // For now we can just log that we're reducing the state with some action
        console.log('Reducing state...', state, action);
        // We'll need a copy of the state, but it will depend on the action type we dispatched
        let newState;
        switch (action.type) {
            case CREATE_TASK:
                // For creating a new task, we'll create a copy of the state using the spread operator
                // Remember: the spread operator creates a shallow copy of nested data
                // If we pushed a new task into the tasks array without the second spread for the tasks: property, it would mutate the array
                newState = { ...state, tasks: [...state.tasks] };
                // Push the new task to the copy of the state
                newState.tasks.push({
                    id: id(),
                    content: action.value,
                    complete: false
                });
                return newState;
            case SHOW_TASKS:
                //  Create a copy of the state again, but add the new value for showCompletedItems
                newState = { ...state, tasks: [...state.tasks], showCompletedItems: action.value };
                return newState;
        }
        // Default to returning the original state, if the action doesn't match something we've defined
        return state;
        // After this, the only thing left to do is register a listener on the store to call the render() function with the reduced state
    }
    // Define a helper method to get the current state
    getState() {
        return this._state;
    }
}

// Define an HTML template for our tasks - aka a Task Component
const TaskComponent = ({ content, complete, id }) => (
    // Parens to implicitly return the contents of the function
    `
    <section>
        ${content} <input type="checkbox" name="taskCompleteCheck" data-taskid="${id}" ${complete ? "checked" : ""}>
    </section>
    `
);

// Render method to handle DOM changes based on the state of the application, which may be update by the results of actions
const render = () => {
    // Grab the task section from the DOM
    const tasksSection = document.getElementById('tasks');
    // Then we get a reference to the state
    const state = tasksStore.getState();
    // Next, we want to filter tasks that appear on the page based on whether Show Complete has been toggled
    const rendered = state.tasks.filter(task => state.showCompletedItems ? true : !task.complete)
        // Then we want to apply the HTML formatting of the TaskComponent to each task we've filtered out of the state
        .map(TaskComponent)
        // finally we'll join the array on an empty string to create a contiguous string of HTML
        .join('');
    tasksSection.innerHTML = rendered;
}

// With a render method and component in place, we need to add event listeners for changes to the tasks / the DOM
document.forms.newTask.addEventListener('submit', (e) => {
    // Prevent form from submitting
    e.preventDefault();
    // Grab the value of the task name input field
    const name = e.target.newTaskName.value;
    if (name) {
        // As long as the task name field isn't empty, dispatch the create task action
        tasksDispatcher.dispatch(createNewTaskAction(name));
        // Empty the input field for re-use
        e.target.newTaskName.value = null;
    }
});

// Similarly, we'll add a listener to the show complete button to dispatch the show complete action
document.getElementById('showComplete').addEventListener('change', ({ target }) => {
    // Grab the 'checked' value from the input element
    const showComplete = target.checked;
    // Dispatch the show task action with the value of showComplete
    tasksDispatcher.dispatch(showTaskAction(showComplete));
});

// Now we can create a new instance of tasksStore
const tasksStore = new TasksStore(tasksDispatcher);

// Register a listener with the TasksStore to render() any changes to the page when state is reduced
tasksStore.addListener(() => {
    render();
    // Using a thunk, remembering that the dispatcher expects a function to call, not the result of calling a function
});

// Call the render function to grabs tasks from the store, and display them when the page loads
render();