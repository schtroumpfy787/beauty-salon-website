//////////////////////////// INTRO SECTION OF THE HOME PAGE ////////////////////////////

// Imports
import { compliment } from './../data/constants.js';
// Media Queries
const mqLandscape = window.matchMedia('(orientation: landscape)');
// HTML Elements
const topTitle = document.querySelector('.intro__animatedTitle span');
const cutout = document.querySelector(".cutout");
const cutoutBox = document.querySelector("#cutoutbox");
const videoContainer = document.querySelector('.intro__containers--video');
const introVideo = document.querySelector('video');
const targetVideo = document.querySelector(".intro__containers video");
const altImg = document.querySelector('.intro__altImg');

///////// START OF THE JS ////////

// Handle video lazy loading
function handleVideoLazyLoading() {
    const videoObserver = new IntersectionObserver(entries => {
        entries.map(entry => entry.isIntersecting ? targetVideo.play() : targetVideo.pause());
    })
    targetVideo ? videoObserver.observe(targetVideo) : null;
}

// Handle video source
function handleVideoSource() {
    if (videoContainer && introVideo) {
        videoContainer.offsetHeight > videoContainer.offsetWidth ?
        introVideo.setAttribute('src', '/videos/IFY_portrait_video.mp4')
        : introVideo.setAttribute('src', '/videos/IFY-Video.mov');
    }
}

// Handle video errors
function handleVideoErrors() {
    if (altImg) {
        altImg.classList.remove('d-none');
        introVideo.classList.add('d-none');
    }
}

// Handle delay between words in the animation
function delay(sec, count) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(compliment[count])
        }, sec)
    })
}

// Handle font size adjustment depending of the length of the word
function handleFontSize(element, container) {
    if (element && container) {
        let elementWidth = element?.clientWidth;
        let containerWidth = container?.clientWidth;
        const currentFontSize = Number(window.getComputedStyle(element)?.fontSize.replace(/px$/, ""));
        let nextFontSize = currentFontSize;
    
        if (elementWidth > containerWidth) {
            while (elementWidth > containerWidth) {
                elementWidth = element?.clientWidth;
                containerWidth = container?.clientWidth;
                nextFontSize -= 0.1;
                element.style.fontSize = `${nextFontSize}px`;
            }
        } else {
            while (elementWidth < containerWidth) {
                elementWidth = element?.clientWidth;
                containerWidth = container?.clientWidth;
                nextFontSize += 0.1;
                element.style.fontSize = `${nextFontSize}px`;
            }
        }
    }
}

// Handle text animation
async function textAnimation() {

    let count = 0;
    let sec = 0;

    if (cutout && cutoutBox && topTitle) {
        while (count <= compliment.length) {
            if (count === compliment.length) {
                count = 0;
                sec = 2300;
            }
    
            handleFontSize(cutout, cutoutBox);
            handleFontSize(topTitle, cutoutBox);
            
            cutout.textContent = await delay(sec, count);
            
            count++;
            sec === 0 ? sec = 2300
            : sec < 400 ? sec = 400
            : sec < 1000 ? sec -= 100
            : sec < 2000 ? sec -= 250
            : sec < 3000 ? sec -= 300
            : sec -= 100;
        }
    }
}

// Call the functions and add the event handlers on load of the page
window.addEventListener("load", () => {
    // decide if the animation should show up or not (on load and resize)
    mqLandscape.matches ? null : textAnimation();
    mqLandscape.addEventListener("change", () => mqLandscape.matches ? null : textAnimation());
    // handle video settings: lazy loading / source (on load and resize) / error
    handleVideoLazyLoading();
    handleVideoSource();
    mqLandscape.addEventListener("change", handleVideoSource);
    introVideo ? introVideo.addEventListener('error', handleVideoErrors) : null;
})