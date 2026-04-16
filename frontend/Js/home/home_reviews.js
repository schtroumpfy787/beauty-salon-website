//////////////////////////// REVIEWS SECTION OF THE HOME PAGE ////////////////////////////

// Imports
import handleFetchComponent from  './../utils/fetchComponent.js';
import handleCarouselLazyLoading from './../utils/lazyCarousel.js';
// HTML Elements
const targetCarousel = document.querySelector("#reviewsCarousel");

// Static reviews data (no Google API dependency)
const staticReviews = [
    {
        text: "Un moment de pure détente ! Brigitte est très professionnelle et à l'écoute. Je recommande vivement l'Institut For You pour tous les soins du visage.",
        name: "Marie L.",
        stars: 5
    },
    {
        text: "Accueil chaleureux, cadre agréable et prestations de qualité. Le massage Kobido est un vrai bonheur. Merci Brigitte !",
        name: "Sophie D.",
        stars: 5
    },
    {
        text: "Je suis cliente depuis l'ouverture et je ne changerais pour rien au monde. Les produits sont excellents et Brigitte est aux petits soins.",
        name: "Isabelle M.",
        stars: 5
    },
    {
        text: "Très satisfaite de mon soin anti-âge. Les résultats sont visibles dès la première séance. Institut à recommander sans hésitation !",
        name: "Catherine R.",
        stars: 5
    },
    {
        text: "Le massage californien était divin. Un vrai moment d'évasion. L'institut est propre, calme et Brigitte est une vraie professionnelle.",
        name: "Nathalie P.",
        stars: 5
    }
];

///////// START OF THE JS ////////

// Display static reviews in the carousel
function displayStaticReviews() {
    if (staticReviews && staticReviews.length > 0) {
        staticReviews.forEach((review, i) => {
            const slide = document.querySelector(`.carousel-item:nth-child(${i + 1}) .blockquote`);
            const bottomName = document.querySelector(`.carousel-item:nth-child(${i + 1}) .blockquote-footer`);
            const topName = document.querySelector(`.carousel-indicators button:nth-child(${i + 1})`);
            const starsIcon = document.querySelectorAll(`.carousel-item:nth-child(${i + 1}) .carousel__stars`);

            if (starsIcon && starsIcon.length > 0) {
                starsIcon.forEach((star, j) => {
                    if (j + 1 <= review.stars) {
                        star.setAttribute("src", "/images/homepage/review_star_icon.svg");
                        star.setAttribute("alt", "review star icon");
                    } else {
                        star.setAttribute("src", "/images/homepage/review_empty_star_icon.svg");
                        star.setAttribute("alt", "review empty star icon");
                    }
                });
            }
            if (slide) slide.textContent = review.text;
            if (bottomName) bottomName.textContent = review.name;
            if (topName) topName.textContent = review.name;
        });
    }
}

// Call the functions and add the event handlers on load of the page
window.addEventListener('load', async () => {
    // fetch carousel
    await handleFetchComponent('/components/reviews.html', targetCarousel);
    // handle carousel lazy loading
    handleCarouselLazyLoading(targetCarousel);
    // display static reviews
    displayStaticReviews();
});
