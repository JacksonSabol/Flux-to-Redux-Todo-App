import { Dispatcher } from "./flux";
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

// Registering the action with the dispatcher of logging the action name
controlPanelDispatcher.register(action => {
    console.info('Received action: ', action);
});