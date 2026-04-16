//////////////////////////// BENEFITS SECTION OF THE HOME PAGE ////////////////////////////

// Imports
import { setUpSlideInAnimation } from "./../utils/slideInObserver.js";
// HTML Elements
const images = document.querySelectorAll('.benefit__img');

///////// START OF THE JS ////////

// Handle slide in animation
function handleBenefitsSlideInImages() {
    images && images.length > 0 ? images.forEach((img, i) => {
        setUpSlideInAnimation(img, i % 2 === 0 ? 'right' : 'left');
    }) : null;
}

// Call the functions and add the event handlers on load of the page
window.addEventListener("load", () => {
    handleBenefitsSlideInImages();
})
