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
        // Then we return the (not actually yet) reduced state
        return state;
    }
    // Define a helper method to get the current state
    getState() {
        return this._state;
    }
}

// Now we can create a new instance of tasksStore
const tasksStore = new TasksStore(tasksDispatcher);

// Then we'll test it out with a test dispatch
tasksDispatcher.dispatch('TEST_DISPATCH');