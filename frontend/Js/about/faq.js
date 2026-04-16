//////////////////////////// FAQ ACCORDION ////////////////////////////

// Imports
import handleFetchComponent from './../utils/fetchComponent.js';
import { setUpSlideInAnimation } from './../utils/slideInObserver.js';
// HTML Elements
const faq = document.querySelector('.faq');

///////// START OF THE JS ////////

// Call the functions and add the event handlers on load of the page
window.addEventListener("load", async () => {
    // handle fetch faq component
    await handleFetchComponent('/components/faq.html', faq);
    // handle faq slide in animation
    setUpSlideInAnimation(faq, 'bottom');
})