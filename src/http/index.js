import { generate as id } from 'shortid';

// Define the time to wait for a simulated HTTP call
const asyncAwaitTime = 500;
// Mock the http module's get method for simulating a GET request
export const get = (url, cb) => {
    setTimeout(() => {
        // At the end of the timeout, call the callback function with a new short id
        cb(id());
    }, asyncAwaitTime)
}