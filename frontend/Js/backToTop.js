//////////////////////////// FOOTER ////////////////////////////

// Imports
import { colorContrastPalette } from './data/constants.js';

function debounce(fn, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

// HTML Elements
const backToTopBtn = document.querySelector('.scrollTop');

///////// START OF THE JS ////////

// handle detect the current background color of the element positioned just behind the button
function handleDetectBgColor() {

    const currentBtnColor = backToTopBtn ? getComputedStyle(backToTopBtn).backgroundColor.match(/\d+/g) : null;
    const currentBtnPositionX = backToTopBtn.getBoundingClientRect().x;
    const currentBtnPositionY = backToTopBtn.getBoundingClientRect().y;
    
    if (currentBtnColor && currentBtnPositionX && currentBtnPositionY) {

        const backgroundElems = document.elementsFromPoint(currentBtnPositionX, currentBtnPositionY);

        let bgColor;

        if (backgroundElems && backgroundElems.length > 0) {

            for (let i = 0; i < backgroundElems.length; i++) {
    
                let differentThanZero = false;
                const [r, g, b] = getComputedStyle(backgroundElems[i]).backgroundColor.match(/\d+/g);
    
                [r, g, b].map(colorCompo => {
                    if (Number(colorCompo) !== 0) {
                        differentThanZero = true;
                    }
                })
    
                if (differentThanZero) {
                    bgColor = [r, g, b];
                    break;
                }
            }
        }

        return {
            btnBgColor: bgColor ? currentBtnColor : null,
            bgElemBgColor: bgColor ? bgColor : null
        }

    } else {
        return {
            btnBgColor: null,
            bgElemBgColor: null
        }
    }
}

// handle check luminance of a color (math formula found online)
function handleCheckColorLuminance(r, g, b) {
    const [lumR, lumG, lumB] = [r, g, b].map(colorComponent => {
        const proportion = colorComponent / 255;
        return proportion <= 0.03928
            ? proportion / 12.92
            : Math.pow((proportion + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * lumR + 0.7152 * lumG + 0.0722 * lumB;
}

// handle check contrast ratio
function handleCheckContrastRatio(lumOne, lumTwo) {
    let lighterLum = Math.max(lumOne, lumTwo);
    let darkerLum = Math.min(lumOne, lumTwo);
    return (lighterLum + 0.05) / (darkerLum + 0.05);
}

// handle adjust the button bg color depending on the background element bg color
function handleAdjustBgColor(colorSet = undefined) {
    // get the btn current or hypothetical bg color and the bg color of the element postioned just behind
    const { btnBgColor, bgElemBgColor } = colorSet ? colorSet : handleDetectBgColor();
    // get the luminance of each bg color
    const btnBgColorLum = btnBgColor?.length > 0 ? handleCheckColorLuminance(btnBgColor[0], btnBgColor[1], btnBgColor[2]) : null;
    const bgElemBgColorLum = bgElemBgColor?.length > 0 ? handleCheckColorLuminance(bgElemBgColor[0], bgElemBgColor[1], bgElemBgColor[2]) : null;
    // get the contrast ratio
    const contrastRatio = btnBgColorLum !== null && bgElemBgColorLum !== null ? handleCheckContrastRatio(btnBgColorLum, bgElemBgColorLum) : null;
    // if the contrast ratio is null, return
    if (!contrastRatio) return;
    // if the contrast isn't high enough (<5), check if the btn bg color has too be lighter or darker
    if (contrastRatio < 5) {

        let findBtnColorIndex = colorContrastPalette.findIndex(color => color[0] == btnBgColor[0] && color[1] == btnBgColor[1] && color[2] == btnBgColor[2]);
        // if the exact color is not found in the palette, find the closest one
        if (findBtnColorIndex < 0) {
            findBtnColorIndex = colorContrastPalette.findIndex((color, i) => {
                const target = btnBgColor[2];
                return color[2] >= target && colorContrastPalette[i + 1] <= target;
            }) 
        }

        const moreContrast = btnBgColor[2] < bgElemBgColor[2] ? 'darker' 
        : btnBgColor[2] > bgElemBgColor[2] ? 'lighter'
        : btnBgColor[2] == bgElemBgColor[2] ? (
            findBtnColorIndex <= colorContrastPalette.length / 2 ? 'darker' : 'lighter'
        )
        : null;
        // recursive call with the new color
        if (moreContrast === 'lighter') {
            handleAdjustBgColor({ 
                btnBgColor: findBtnColorIndex - 1 < 0 
                ? colorContrastPalette[colorContrastPalette.length - 1]
                : colorContrastPalette[findBtnColorIndex - 1], 
                bgElemBgColor: bgElemBgColor 
            });
        } else if (moreContrast === 'darker') {
            handleAdjustBgColor({ 
                btnBgColor: findBtnColorIndex + 1 > colorContrastPalette.length - 1
                ? colorContrastPalette[0]
                : colorContrastPalette[findBtnColorIndex + 1], 
                bgElemBgColor: bgElemBgColor 
            });
        }
    // if the contrast is good enough, apply the color to the button
    } else {
        backToTopBtn.style.backgroundColor = `rgb(${btnBgColor.join(',')})`;
        backToTopBtn.style.color = `rgb(${bgElemBgColor.join(',')})`;
    }

}

// handle scroll back to top
function handleScrollBackToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}


// Call the function and add the event handlers on load of the page
window.addEventListener('load', () => {
    // adjust the back to top cutton bg color on load and on scroll
    window.addEventListener('scroll', debounce(() => handleAdjustBgColor(), 50));
    handleAdjustBgColor();
    // scroll back to top on click
    backToTopBtn.addEventListener('click', handleScrollBackToTop);
});


