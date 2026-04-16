//////////////////////////// BENEFITS SECTION OF THE HOME PAGE ////////////////////////////

// Imports
import { setUpSlideInAnimation } from './../utils/slideInObserver.js';
// HTML Elements
const ownerDescriptionContainer = document.querySelector('.owner');

///////// START OF THE JS ////////

// Call the functions and add the event handlers on load of the page
window.addEventListener("load", () => {
    // handle slide in animation
    setUpSlideInAnimation(ownerDescriptionContainer, 'bottom');
})