// Handle slide in animations
function handleLeftIntersect(entries) {
    entries.forEach(entry => {
        // get the animations of the target
        let elemAnimation = entry.target.getAnimations()[0];
        // if the animation is already running, ignore the entries because they are triggered by the animation which moves the elements
        if (elemAnimation?.playState === 'running' ) return;
        // if the target is intersecting with the viewport and is postioned below the viewport launch the animation
        if (entry.intersectionRatio > 0 && entry.boundingClientRect.top > 0) {
            animateElem(entry.target, 'translateX(-100%)', 'translateX(0)');
        }
        // if the target is no more intersecting with the viewport and is positioned above the viewport make the target invisible
        if (entry.intersectionRatio === 0 && entry.boundingClientRect.top > 0) {
            entry.target.style.opacity = 0;
        }
    })
};

function handleRightIntersect(entries) {
    entries.forEach(entry => {
        // get the animations of the target
        let elemAnimation = entry.target.getAnimations()[0];
        // if the animation is already running, ignore the entries because they are triggered by the animation which moves the elements
        if (elemAnimation?.playState === 'running') return;
        // if the target is intersecting with the viewport and is postioned below the viewport launch the animation
        if (entry.intersectionRatio > 0 && entry.boundingClientRect.top > 0) {
            animateElem(entry.target, 'translateX(100%)', 'translateX(0)');
        }
        // if the target is no more intersecting with the viewport and is positioned above the viewport make the target invisible
        if (entry.intersectionRatio === 0 && entry.boundingClientRect.top > 0) {
            entry.target.style.opacity = 0;
        }
    })
};

function handleBottomIntersect(entries) {
    entries.forEach(entry => {
        // get the animations of the target
        let elemAnimation = entry.target.getAnimations()[0];
        // if the animation is already running, ignore the entries because they are triggered by the animation which moves the elements
        if (elemAnimation?.playState === 'running' ) return;
        // if the target is intersecting with the viewport and is postioned below the viewport launch the animation
        if (entry.intersectionRatio > 0 && entry.boundingClientRect.top > 0) {
            animateElem(entry.target, 'translateY(200%)', 'translateY(0)');
        }
        // if the target is no more intersecting with the viewport and is positioned above the viewport make the target invisible
        if (entry.intersectionRatio === 0 && entry.boundingClientRect.top > 0) {
            entry.target.style.opacity = 0;
        }
    })
};

async function animateElem(elem, translateStarts, translateEnds) {
    // get the animations of the target
    let elemAnimation = elem.getAnimations()[0];
    // if there is no animation yet, create one
    if (!elemAnimation) {
        const slideInKeyframes = new KeyframeEffect(
            elem, 
            [
                { transform: translateStarts, opacity: 0, '-webkit-transform': translateStarts },
                { transform: translateEnds, opacity: 1, '-webkit-transform': translateEnds },
            ],
            { duration: 1500, fill: "forwards", easing: 'ease-in-out' },
        );
        elemAnimation = new Animation(slideInKeyframes, document.timeline);
    }
    // Play the animation
    elemAnimation.play();
    // Wait for the animation to finish
    await elemAnimation.finished;
    // Commit animation state to style attribute
    elemAnimation.commitStyles();
    // Cancel the animation
    elemAnimation.cancel();

    if (elem === document.querySelector('.gallery')) elem.style.transform = 'none';
};

const leftObserver = new IntersectionObserver(handleLeftIntersect, { threshold: [0], rootMargin: '30px', root: null });
const rightObserver = new IntersectionObserver(handleRightIntersect, { threshold: [0], rootMargin: '30px', root: null });
const bottomObserver = new IntersectionObserver(handleBottomIntersect, { threshold: [0], rootMargin: '30px', root: null });

export function setUpSlideInAnimation(targetElem, direction) {
    // observe the target
    if (direction === 'left') {
        leftObserver.observe(targetElem);
    } else if (direction === 'right') {
        rightObserver.observe(targetElem);
    } else if (direction === 'bottom') {
        bottomObserver.observe(targetElem);
    } else {
        console.log('invalid slide in direction');
    }
};