//////////////////////////// FOOTER ////////////////////////////

// Imports
import './external-code/gm_mapsapi.js';
import handleFetchComponent from './utils/fetchComponent.js';
// HTML Elements
const footerWrapper = document.querySelector('#footer');

///////// START OF THE JS ////////

async function handleFetchMap() {

    // declare variables
    let map;
    let marker;
    let infowindow;
    const position = { lat: 43.8087399, lng: 4.6635764 };
    
    try {
        const { Map } = await google.maps.importLibrary("maps");
        const { Marker } = await google.maps.importLibrary("marker");
        const { InfoWindow } = await google.maps.importLibrary("maps");
        const { Animation } = await google.maps.importLibrary("marker");

        if (Map) {
            // create the map and configure it
            map = new Map(document.getElementById("footer__map"), {
                center: position,
                zoom: 15,
            });

            map.setCenter(position);
        }

        if (Map && Marker && Animation) {
            // create the marker (pin) and set its animation
            const icon = google.maps.Icon = {url: '/images/homepage/pin_icon.svg'}
            
            marker = new Marker({
                map: map,
                position: position,
                clickable: true,
                icon: icon,
            })

            marker.setAnimation(Animation.DROP);
        }

        // create the bubble (info window) and its elements
        const content = document.createElement('div');
        const title = document.createElement('h3');
        const addressLineOne = document.createElement('p');
        const addressLineTwo = document.createElement('p');
        const addressLineThree = document.createElement('p');

        content.appendChild(title);
        content.appendChild(addressLineOne);
        content.appendChild(addressLineTwo);
        content.appendChild(addressLineThree);

        title.textContent = "Institut For You";
        addressLineOne.textContent = "3 Faubourg Voltaire";
        addressLineTwo.textContent = "13150 Tarascon";
        addressLineThree.textContent = "France"
        content.classList.add('footer__bubble');
        title.classList.add('heading-4');

        if (Map && Marker && InfoWindow) {
            infowindow = new InfoWindow({
                minWidth: 250,
            });
    
            infowindow.setContent(content);
    
            const openoptions = infowindow.InfoWindowOpenOptions = {
                anchor: marker,
                map: map,
                shouldFocus: false
            }
    
            infowindow.open(openoptions);
    
            google.maps.event.addListener(marker, "click", function() {
                infowindow.open(openoptions);
            })
        }
    } catch (error) {
        console.log(error);
    }
}

// Call the function and add the event handlers on load of the page
window.addEventListener('load', async () => {
    if (footerWrapper) {
        // fetch the footer
        await handleFetchComponent('/components/footer.html', footerWrapper);
        // fetch the map
        handleFetchMap();
    }
});


