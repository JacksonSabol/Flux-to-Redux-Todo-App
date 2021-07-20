// Library to quickly generate unique IDs
import { generate as id } from 'shortid';
import { Dispatcher, ReduceStore } from './flux';

// Create a tasks/todos specific dispatcher instance
const tasksDispatcher = new Dispatcher();

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