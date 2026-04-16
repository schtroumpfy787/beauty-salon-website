//////////////////////////// IMAGE GALLERY SECTION OF THE ABOUT PAGE ////////////////////////////

// Imports
import { salonImages } from '../data/salonImages.js';
import { setUpSlideInAnimation } from './../utils/slideInObserver.js';
// HTML Elements
const imgContainer = document.querySelector('.gallery__imgContainer');
const filterBtn = document.querySelectorAll('.gallery__filter');
const gallery = document.querySelector('.gallery');
const backToTopBtn = document.querySelector('.scrollTop');

///////// START OF THE JS ////////

// handle creation of image elements
function createImgElem(column, src, alt) {
    const imgWrapper = document.createElement('span');
    const img = document.createElement('img');
    img.setAttribute('src', src);
    img.setAttribute('alt', alt);
    imgWrapper.appendChild(img);
    column ? column.appendChild(imgWrapper) : null;
    img.addEventListener('click', (e) => handleImgZoom(e));
}

// handle gallery column layout
function createImgLayout(col, imgCollection) {

    // cleanup by removing the current html if any
    if (imgContainer && imgContainer.innerHTML) {
        while (imgContainer.firstChild) {
            imgContainer.removeChild(imgContainer.firstChild);
        }
    }

    // create the number of columns needed
    let i = 0;
    let totalColumns = [];

    while (i < col) {
        const newColumn = document.createElement('div');
        newColumn.classList.add('gallery__column');
        imgContainer.appendChild(newColumn);
        totalColumns.push(newColumn);
        i++;
    }

    const totalImg = imgCollection.length; 
    let currentColumn = 0;

    for (let i = 0; i < totalImg; i++) {
        currentColumn++;
        if (currentColumn === totalColumns.length || i === 0) {
            currentColumn = 0;
        }
        createImgElem(totalColumns[currentColumn], imgCollection[i].src, imgCollection[i].alt)
    }
}

// handle columns number depending on the viewport width
function handleWindowSize(imgCollection) {
    const vw = window.innerWidth;
    if (vw) {
        return vw <= 768 ? createImgLayout(2, imgCollection)
        : vw <= 1200 ? createImgLayout(3, imgCollection)
        : createImgLayout(4, imgCollection);
    }
}

// Handle gallery filtering 
function handleGalleryFilter(filter) {
    switch (filter) {
        case "all":
            handleWindowSize(salonImages);
            break;
        case "lobby":
            handleWindowSize(salonImages.filter(img => img.type === "lobby"));
            break;
        case "massage":
            handleWindowSize(salonImages.filter(img => img.type === "massage"));
            break;
        case "products":
            handleWindowSize(salonImages.filter(img => img.type === "products"));
            break;
        default:
            throw new Error('filter not reconized!')
    }
}

// Handle img foreground view
function handleImgZoom(e) {
    const selectedImg = e.target;
    const selectedImgBox = selectedImg ? selectedImg?.parentElement : null;

    if (selectedImg && selectedImgBox) {
        backToTopBtn.classList.add('d-none');
        selectedImg.classList.add('gallery--imgPopup');
        selectedImgBox.classList.add('gallery--bgPopup');
        selectedImgBox.addEventListener('click', (e) => {
    
            if (e.target === selectedImgBox) {
                backToTopBtn.classList.add('d-flex');
                selectedImg.classList.remove('gallery--imgPopup');
                selectedImgBox.classList.remove('gallery--bgPopup');
            }
        })
    }
};

// Call the functions and add the event handlers on load of the page
window.addEventListener("load", () => {
    // handle gallery photo creation on load and resize
    handleWindowSize(salonImages);
    window.addEventListener('resize', () => handleWindowSize(salonImages));
    // handle image filtering
    filterBtn.forEach(btn => btn.addEventListener('click', (e) => handleGalleryFilter(e.target.id)));
    // handle slide in animation
    setUpSlideInAnimation(gallery, 'bottom');
})


