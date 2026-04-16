//////////////////////////// MASSAGES PAGE ////////////////////////////

// Imports
import scrollToElem from "./../utils/scrollToElem.js";
import { setUpSlideInAnimation } from "./../utils/slideInObserver.js";
// Media Queries
const mediaQuery = window.matchMedia("(orientation: portrait) and (max-width: 767px)");
// HTML Elements
const root = document.querySelector(':root');
const overview = document.querySelectorAll('.overview__card');
const overviewBtn = document.querySelectorAll('.overview__card .overview__massageBtn');
const doorIllustration = document.querySelector('.californien__infoIllustration');
const allMassagesDescription = document.querySelectorAll('.massages__massage');
const firstOverviewCard = document.querySelector('.overview__card:nth-child(1)');

///////// START OF THE JS ////////

// Handle overview / summary animation targets
function handleOverviewTargets(e) {

    const clickedTarget = e.target;

    overview.forEach((massageElem, i) => {

        const notSelectedMassages = document.querySelectorAll(`.overview__card:not(:nth-child(${i + 1}))`);
        const activeInfo = document.querySelector(`.overview__card:nth-child(${i + 1}) .overview__active`);

        // handle case where one massage element is already open, so we eventually want to close it
        if (massageElem.classList.contains('overview__card--selected')) {

            // close that element if the user clicked outside of it or on the cross icon
            if (!massageElem.contains(clickedTarget) || clickedTarget.classList.contains('overview__closeCard')) {
                handleToggleOverview(massageElem, notSelectedMassages, activeInfo);
            }
        // handle case where no massage element is opened yet, so we want to open it on click
        } else if (massageElem.contains(clickedTarget)) {
            handleToggleOverview(massageElem, notSelectedMassages, activeInfo);
        }

    });

};

// Handle overview / summary animation modifications
function handleToggleOverview(selectedMassage, notSelectedMassages, activeInfo) {
    // Toggle not selected massages elements opacity between 0 and 1
    notSelectedMassages.forEach(massage => massage.classList.toggle('opacity-0'));
    // Toggle class of the selected element to increase or decrease its size
    selectedMassage.classList.toggle('overview__card--selected');
    // Toggle class of one of the selected element child to show or hide its content
    activeInfo.classList.toggle("d-none");
    // Toggle the pulse animation on the first massage element
    firstOverviewCard.classList.toggle('pulseAnimation');
}

// Handle scroll to elem on click
function handleScrollOnClick() {
    overviewBtn.forEach((btn, i) => {
        const massageDescription = document.querySelector(`.massages__massage:nth-child(${i + 1})`)
        btn.addEventListener('click', () => scrollToElem(massageDescription));
    })
};

// Handle "door" info reveal animation
function handleDoorReveal() {

    const imgAnimName = window.getComputedStyle(root).getPropertyValue('--imgAnimName');

    if (imgAnimName === "moveTopLeft" || imgAnimName.includes('showContent')) {
        root.style.setProperty('--hiddenInfoAnimName', 'moveBottomRight');
        root.style.setProperty('--hiddenInfoAnimState', 'paused');
        root.style.setProperty('--imgAnimName', 'moveTopLeft, hideContent');
        root.style.setProperty('--imgAnimState', 'paused, running');
        root.style.setProperty('--doorShapeAnimState', 'paused');
    } else if (!imgAnimName.includes('showContent')) {
        root.style.setProperty('--hiddenInfoAnimName', 'moveBottomRight');
        root.style.setProperty('--hiddenInfoAnimState', 'running');
        root.style.setProperty('--imgAnimName', 'moveTopLeft, showContent');
        root.style.setProperty('--imgAnimState', 'running');
        root.style.setProperty('--doorShapeAnimState', 'running');
    }
};

// Handle overview cards slide in animation
function handleOverviewCardsAnimation() {
    overview && overview.length > 0 ? overview.forEach((summary, i) => {
        if (i === 0) setUpSlideInAnimation(summary, 'left');
        if (i === 1) setUpSlideInAnimation(summary, mediaQuery.matches ? 'right' : 'left');
        if (i === 2) setUpSlideInAnimation(summary, mediaQuery.matches ? 'left' : 'right');
        if (i === 3) setUpSlideInAnimation(summary, 'right');
    }) : null
};

// Call the functions and add the event handlers on load of the page
window.addEventListener("load", () => {
    // Handle overview click 
    window.addEventListener('click', handleOverviewTargets);
    // Handle scroll to elem
    handleScrollOnClick();
    // Handle "door reveal" animation 
    doorIllustration ? doorIllustration.addEventListener('click', handleDoorReveal) : null;
    // Handle massages description slide in animation
    allMassagesDescription && allMassagesDescription.length > 0 ? allMassagesDescription.forEach(massageElem => setUpSlideInAnimation(massageElem, 'bottom')) : null;
    // Handle massages summary / overview slide in animation
    handleOverviewCardsAnimation();
    // After the slide in animation of the overview boxes, play the pulse animation
    setTimeout(() => firstOverviewCard.classList.add('pulseAnimation'), 1500);
});