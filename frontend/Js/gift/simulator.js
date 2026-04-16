//////////////////////////// GIFT SIMULATOR OF THE GIFT PAGE ////////////////////////////

// Imports
import { services_data } from './../data/servicesData.js';
import handleCarouselLazyLoading from './../utils/lazyCarousel.js';
import { setUpSlideInAnimation } from './../utils/slideInObserver.js';
// Media Queries
const mediaQuery = window.matchMedia("(orientation: portrait) and (max-width: 576px)");
// HTML Elements
const simulatorContainer = document.querySelector('.giftpage__simulator');
const simulatorForm = document.querySelector('.giftpage__simulatorForm');
const simulatorSelect = document.querySelector('.giftpage__simulatorSelect');
const simulatorInput = document.querySelector('.giftpage__simulatorInput');
const simulationResultWrapper = document.querySelector('.giftpage__simulatorResults');
const hr = document.querySelector('hr');
const simulatorAmount = document.querySelector('.giftpage__simulatorAmount');
const simulatorResultBest = document.querySelector('.giftpage__simulatorResultsBest');
const simulatorResultDuoWrapper = document.querySelector('.giftpage__simulatorResultsDuo');
const simulatorResultDuo = document.querySelectorAll('.giftpage__simulatorResultsDuo div div');
const simulationResultCombo = document.querySelector('.giftpage__simulatorResultsCombo');
const quote = document.querySelector('.giftpage__quote');
const sticky = document.querySelector('.giftpage__sticky');

///////// START OF THE JS ///////

// Handle finding the closest service price from the gift card amount
function handleFindHighestPrice(filteredServicePrices) {
    if (filteredServicePrices && filteredServicePrices.length > 0) {
        return filteredServicePrices.reduce((mostExpensiveService, currentService)=>
        currentService.price > mostExpensiveService.price ? currentService : mostExpensiveService
      , { price: 0 });
    }
}

// Handle finding all the service price duos that sum up to the target price
function handleFindBestServiceDuo(maximumServicePrice, filteredServicesList) {
    if (maximumServicePrice && maximumServicePrice >= 40 && maximumServicePrice <= 200 && filteredServicesList && filteredServicesList.length > 0) {
        // if the target gift price has decimals, round it down to the largest integer smaller than itself
        let maxAmount = Math.floor(maximumServicePrice);
        const duo = [];
        // recursively go through the array to find a pair that sums up to the target price
        function servicesPricesReview(targetPrice) {
            filteredServicesList.map((firstService, index) => {
              const i = filteredServicesList.findIndex((secondService, i) => i > index && targetPrice === Math.round(secondService.price) + Math.round(firstService.price));
              if (i > -1) {
                duo.push([firstService, filteredServicesList[i]])
                return duo;
              }
            });
            // if a duo has been found return it
            if (duo.length > 0) return duo;
            // this case should never happen but just for safety to avoid inifite loop
            if (maxAmount <= 0) return [];
            // call again the same function with a reduced target price until finding a duo that sums up to it
            servicesPricesReview(targetPrice - 1);
        }
        // initial function call with the initial price target
        servicesPricesReview(maxAmount);
        // return the duos found
        return duo;
    }
}

// Handle finding all the prices combinaisons that sum up to the price target
function handleFindServicesCombinaisons(servicesList, targetGiftPrice) {
    if (targetGiftPrice && targetGiftPrice >= 40 && targetGiftPrice <= 200 && servicesList && servicesList.length > 0) {
        let result = []
        // search all the possible combinaisons inside of the "solution" tree
        function deepFirstSearch(index, targetGiftPrice, candidatesArray) {
            // if the sum of the prices in the array is bigger than the desired gift price, return because it means we won't find any solution in that branch
            if (targetGiftPrice < 0) return;
            // if the sum of the prices in the array is equal to the desired gift price, copy this array and push it into the result array
            if (targetGiftPrice === 0) {
                result.push([...candidatesArray])
                return;
            }
            // recursion (start at index to avoid duplications)
            for (let i = index; i < servicesList.length; i++) {
                candidatesArray.push(servicesList[i])
                // call again with i + 1 and not i to use a every price only one single time
                deepFirstSearch(i + 1, targetGiftPrice - servicesList[i].price, candidatesArray)
                // backtrack (get back up one tree node)
                candidatesArray.pop()
            }
        }
        // initial function call
        deepFirstSearch(0, targetGiftPrice, [])
        // return final result array with all combinaisons
        return result;
    }
};

// Handle gift suggestions
function handleGiftSuggestions(targetPrice, servicesList) {
    if (targetPrice && targetPrice >= 40 && targetPrice <= 200 && servicesList && servicesList.length > 0) {
        // remove all the services that are more expensive than the total gift amount
        const filteredServicesList = servicesList.filter(opt => opt.price <= targetPrice);
        if (filteredServicesList && filteredServicesList.length > 0) {
            // find all the unique prices in the filtered services list
            const servicesWithUniquePrice = [...filteredServicesList].reduce((arr, current) => {
              if (!arr) return [];
              return arr.findIndex(service => service.price === current.price) === -1 ? [...arr, current] : arr
            }, []);
            // find out what is the most expensive service the person could get for the gift card amount
            const best_service = handleFindHighestPrice(filteredServicesList);
            const highestServicePrice = best_service && best_service.price ? best_service.price : 0;
            // find out what duos of services the person could get for the gift card amount
            const best_duo = handleFindBestServiceDuo(targetPrice, filteredServicesList);
            const highestDuoPrice = best_duo && best_duo.length > 0 ? best_duo[0][0]?.price + best_duo[0][1]?.price : 0;
            // depending on the gift card amount and the services prices, determine what kind of suggestions to provide
            if (highestDuoPrice + 10 < targetPrice && highestServicePrice + 10 < targetPrice) {
                // CASE 1: two combos - expensive gift
                // find out all the possible combiaisons of unique prices summing up to the gift card amount
                const best_combo = handleFindServicesCombinaisons(servicesWithUniquePrice, targetPrice);
                // select both combos (the shortest and the longest one)
                if (best_combo && best_combo.length >= 2) {

                    let shortestCombo = { comboLength: null, combo: [] };
                    let longestCombo = { comboLength: null, combo: [] };

                    for (let i = 0; i < best_combo.length; i++) {
                        !shortestCombo.comboLength || best_combo[i].length < shortestCombo.comboLength ?
                        shortestCombo = { comboLength: best_combo[i].length, combo: best_combo[i] }
                        : !longestCombo.comboLength || best_combo[i].length > longestCombo.comboLength ?
                        longestCombo = { comboLength: best_combo[i].length, combo: best_combo[i] }
                        : null;
                    }

                    return {
                      combo: [shortestCombo.combo, longestCombo.combo]
                    }
                } 
            } else if (highestDuoPrice + 10 >= targetPrice && highestServicePrice + 10 < targetPrice) {
                  // CASE 2: one duo and one combo (3 services or more) - average gift
                  // select one duo
                  const filteredDuos = best_duo && best_duo.length > 0 ? best_duo.filter(combo => combo[0]?.group !== combo[1]?.group) : null;
                  const selectedDuo = filteredDuos.length === 0 ? best_duo[0] : filteredDuos[0];
                  // select one combo
                  const best_combo = handleFindServicesCombinaisons(servicesWithUniquePrice, targetPrice);
                  const selectedCombo = best_combo && best_combo.length >= 1 ? best_combo.find(combo => combo.length >= 3) : best_combo[0];

                  return {
                    duo: selectedDuo,
                    combo: [selectedCombo]
                  }
            } else {
                // CASE 3: one single service (best) and one duo - cheaper gift
                // we just need to select a duo as we already have the most expensive service
                const filteredDuos = best_duo && best_duo.length > 0 ? best_duo.filter(combo => combo[0]?.group !== combo[1]?.group) : null;
                const selectedDuo = filteredDuos.length === 0 ? best_duo[0] : filteredDuos[0];

                return {
                  best: best_service,
                  duo: selectedDuo
                }
            }
        }
    }
    throw new Error('Something went wrong in your function. It did not return.');
}

// handle submission of the gift simulator form
function handlegiftSimulatorSubmission(e) {
    // check if the form is valid
    e.preventDefault();
    simulatorForm.classList.add('was-validated');
    if (!simulatorForm.reportValidity()) return;
    // reset the classes
    const comboOne = document.querySelector(`.giftpage__combo:nth-child(1)`);
    const comboTwo = document.querySelector(`.giftpage__combo:nth-child(2)`);
    [simulatorResultBest, simulatorResultDuoWrapper, simulationResultCombo, comboOne, comboTwo].map(elem => elem.classList.add('d-none'));
    // configure and display the simulation
    let simulationResult;
    if (simulatorInput.value === '') {
      simulationResult = handleGiftSuggestions(Number(simulatorSelect.selectedOptions[0].value), services_data);
      handleGiftsDisplay(simulationResult, simulatorSelect.selectedOptions[0].value);
    } else {
      simulationResult = handleGiftSuggestions(Number(simulatorInput.value), services_data);
      handleGiftsDisplay(simulationResult, simulatorInput.value);
    }
    simulatorInput.value = '';
    simulationResultWrapper.classList.remove('d-none');
    hr.classList.remove('d-none');
    quote.classList.add('giftpage__quote--active');
    sticky.classList.add('giftpage__sticky--fullHeight');
}

// handle display potential gifts
function handleGiftsDisplay(simulationOutput, amount) {

  // Fill the gift amount in the first paragraph
  if (amount) simulatorAmount.innerHTML = `${amount}&euro;`;

  // Fill the single result section
  if (simulationOutput && simulationOutput?.best) {
    const { best } = simulationOutput;
    simulatorResultBest.classList.remove('d-none');
    // add the slide in animation
    setUpSlideInAnimation(simulatorResultBest, mediaQuery.matches ? 'left' : 'bottom');
    Array.from(simulatorResultBest.children).map(elem => {
      elem.tagName === 'H4' ? elem.innerHTML = `<a href=${best?.path}>${best?.name}</a>`
      : elem.tagName === 'IMG' ? elem.setAttribute('src', best?.img) && elem.setAttribute('alt', best?.alt)
      : elem.tagName === 'STRONG' ? elem.innerHTML = `${best?.price}&euro;`
      : null;
    })
  }

  // Fill the duo section
  if (simulationOutput && simulationOutput?.duo) {
      const { duo } = simulationOutput;
      simulatorResultDuoWrapper.classList.remove('d-none');
      // add the slide in animation
      setUpSlideInAnimation(simulatorResultDuoWrapper, !simulationOutput?.best && mediaQuery.matches && simulationOutput?.combo && simulationOutput?.combo?.length > 0 ? 'left' : simulationOutput?.best && mediaQuery.matches ? 'right' : 'bottom');
      simulatorResultDuo.forEach((div, i) => {
        const children = div.children;
        return Array.from(children).map(elem => {
          return elem.tagName === 'H4' ? elem.innerHTML = `<a href=${duo[i]?.path}>${duo[i]?.name}</a>`
          : elem.tagName === 'IMG' ? elem.setAttribute('src', duo[i]?.img) && elem.setAttribute('alt', duo[i]?.alt)
          : elem.tagName === 'STRONG' ? elem.innerHTML = `${duo[i]?.price}&euro;`
          : null;
        })
      });
  }

  // Fill the combo carousel
  if (simulationOutput && simulationOutput?.combo) {
      simulationResultCombo.classList.remove('d-none');
      // add the slide in animation
      setUpSlideInAnimation(simulationResultCombo, simulationOutput?.duo && simulationOutput?.duo?.length > 0 && mediaQuery.matches ? 'right' : 'bottom');
      simulationOutput.combo.map((combo, i) => {
        const carouselWrapper = document.querySelector(`.giftpage__combo:nth-child(${i + 1})`);
        const carousel = document.querySelector(`.giftpage__combo:nth-child(${i + 1}) .carousel`);
        const carouselIndicators = document.querySelector(`.giftpage__combo:nth-child(${i + 1}) .carousel .carousel-indicators`);
        const carouselContent =  document.querySelector(`.giftpage__combo:nth-child(${i + 1}) .carousel .carousel-inner`);

        if (carouselWrapper && carousel && carouselIndicators && carouselContent) {
          // clean the html
          carouselIndicators.innerHTML = '';
          carouselContent.innerHTML = '';
          carouselWrapper.classList.remove('d-none');
          // handle lazy loading
          handleCarouselLazyLoading(carousel);
          combo.map((service, j) => {
              // create the indicators
              const btn = document.createElement('button');
              j === 0 ? btn.classList.add('active') : null;
              const attributes = {
                type: "button",
                ['data-bs-target']: `#giftSimulator${i + 1}`,
                ['data-bs-slide-to']: j,
                ['aria-current']: j === 0 ? true : false,
                ['aria-label']: `Slide ${j + 1}`
              }
              for (const attr in attributes) {
                btn.setAttribute(attr, attributes[attr]);
              }
              carouselIndicators ? carouselIndicators.appendChild(btn) : null;
              // create the slide content
              const slideWrapper = document.createElement('div');
              const slide = document.createElement('div');
              const img = document.createElement('img');
              const caption = document.createElement('div');
              const strong = document.createElement('strong');
              const serviceTitle = document.createElement('h4'); 
              slideWrapper.classList.add('carousel-item');
              j === 0 ? slideWrapper.classList.add('active') : null;
              slide.classList.add('giftpage__comboSlide');
              caption.classList.add('carousel-caption');
              img.setAttribute('src', service?.img);
              img.setAttribute('alt', service?.alt);
              img.classList.add('img-fluid', 'w-100');
              strong.innerHTML = `${service?.price} &euro;`
              serviceTitle.innerHTML = `<a href=${service?.path}>${service?.name}</a>`;
              // add all the elements to the dom
              caption.appendChild(serviceTitle);
              caption.appendChild(strong);
              slide.appendChild(img);
              slide.appendChild(caption);
              slideWrapper.appendChild(slide);
              carouselContent ? carouselContent.appendChild(slideWrapper) : null;
          })
        }
      })
  }
}

// Call the functions and add the event handlers on load of the page
window.addEventListener('load', () => {
  // handle gift simulation form submission
  simulatorForm.addEventListener('submit', (e) => handlegiftSimulatorSubmission(e));
  // handle slide in animation of the simulator container
  setUpSlideInAnimation(simulatorContainer, 'bottom');
})