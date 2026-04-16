//////////////////////////// FOOTER ////////////////////////////

// Imports
import handleFetchComponent from './utils/fetchComponent.js';
// HTML Elements
const footerWrapper = document.querySelector('#footer');

///////// START OF THE JS ////////

function handleStaticMap() {
    const mapContainer = document.getElementById("footer__map");
    if (mapContainer) {
        // Use a static OpenStreetMap embed as a free, no-API-key alternative
        const iframe = document.createElement('iframe');
        iframe.setAttribute('width', '100%');
        iframe.setAttribute('height', '100%');
        iframe.setAttribute('style', 'border:0; min-height: 250px;');
        iframe.setAttribute('loading', 'lazy');
        iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
        iframe.setAttribute('title', 'Carte Institut For You');
        iframe.setAttribute('src',
            'https://www.openstreetmap.org/export/embed.html?bbox=4.655,43.803,4.672,43.814&layer=mapnik&marker=43.8087399,4.6635764'
        );
        mapContainer.appendChild(iframe);
    }
}

// Call the function and add the event handlers on load of the page
window.addEventListener('load', async () => {
    if (footerWrapper) {
        // fetch the footer
        await handleFetchComponent('/components/footer.html', footerWrapper);
        // render the map
        handleStaticMap();
    }
});

