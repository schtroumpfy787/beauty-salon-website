//////////////////////////// HANDLE SUGGESTIONS AFTER CONTACT FORM SUBMISSION ////////////////////////////

// Imports
import { services_data } from './../data/servicesData.js';
import handleFetchComponent from './../utils/fetchComponent.js';
// HTML Elements
const form = document.querySelector('.contact__form');
const contactTopicSelect = document.querySelector('.contact__contactTopic');
const apptSuggestions = document.querySelector('.contact__apptSuggestions');
const otherSuggestions = document.querySelector('.faq');
const feedbackSuggestions = document.querySelector('.contact__feedbackSuggestions');
const carousel = document.querySelector('.carousel');

///////// START OF THE JS ////////

function handleSuggestions() {

    const selectedTopic = contactTopicSelect?.selectedOptions[0]?.value;

    if (selectedTopic && services_data && services_data.length > 0) {

        if (selectedTopic === 'appt' && apptSuggestions) {

            apptSuggestions.classList.remove('d-none');
            apptSuggestions.classList.add('d-flex');
            const hiddenSelect = document.querySelectorAll('.contact__hiddenSelect');

            if (hiddenSelect && hiddenSelect.length >= 4) {

                hiddenSelect.forEach((select, i) => {

                    if (i < 4) {

                        const imgElem = document.querySelector(`.contact__apptSuggestions div:nth-child(${i + 1}) img`);
                        const btnElem = document.querySelector(`.contact__apptSuggestions div:nth-child(${i + 1}) a`);

                        if (btnElem && imgElem) {
                            btnElem.textContent = select.selectedOptions[0].textContent;
        
                            services_data.map(item => {
                                if (item.value === select?.selectedOptions[0]?.value) {
                                    imgElem.setAttribute('src', item?.img);
                                    imgElem.setAttribute('alt', item?.alt);
                                    btnElem.setAttribute('href', item?.path);
                                    btnElem.setAttribute('data-redirect', item?.value);
                                }
                            })
                        }
                    }
                })

            } else {

                let suggestionType = [];

                for (let i = 0; i < 4; i++) {

                    const hiddenSelect = document.querySelectorAll('.contact__hiddenSelect');
                    const imgElem = document.querySelector(`.contact__apptSuggestions div:nth-child(${i + 1}) img`);
                    const btnElem = document.querySelector(`.contact__apptSuggestions div:nth-child(${i + 1}) a`);

                    if (hiddenSelect && hiddenSelect.length > 0 && imgElem && btnElem) {

                        if (i + 1 <= hiddenSelect.length) {
        
                            const select = hiddenSelect[i];
                            btnElem.textContent = select ? select?.selectedOptions[0]?.textContent : null;
                            const optgroup = select ? select?.selectedOptions[0]?.closest('optgroup')?.label : null;
                            suggestionType.includes(optgroup) ? null : suggestionType.push(select?.selectedOptions[0]);
            
                            services_data.map(item => {
                                if (item.value === select?.selectedOptions[0]?.value) {
                                    imgElem.setAttribute('src', item?.img);
                                    imgElem.setAttribute('alt', item?.alt);
                                    btnElem.setAttribute('href', item?.path);
                                    btnElem.setAttribute('data-redirect', item?.value);
                                }
                            })
                            
                        } else {
    
                            while (suggestionType.length < 4) {
                                suggestionType.map(suggestion => suggestionType.push(suggestion));
                            }
    
                            const filteredSuggestions = services_data.filter(suggestion => {
    
                                const parentLabel = suggestionType[3 - i]?.closest('optgroup')?.label;
                                const currentValue = suggestionType[3 - i]?.value;
    
                                return suggestion.group === parentLabel && suggestion.value !== currentValue
    
                            });
    
                            const AllBtn = document.querySelectorAll(`.contact__apptSuggestions div a`);
                            let currentValues = [];
                            AllBtn && AllBtn.length > 0 ? AllBtn.forEach(btn => currentValues.push(btn?.textContent)) : null;
                                
                            let { index: randomSuggestionIndex, value: randomSuggestionValue } = handleGenerateRandom(filteredSuggestions);
    
                            if (!currentValues.includes(randomSuggestionValue)) {
    
                                imgElem.setAttribute('src', filteredSuggestions[randomSuggestionIndex]?.img);
                                imgElem.setAttribute('alt', filteredSuggestions[randomSuggestionIndex]?.alt);
                                btnElem.setAttribute('href', filteredSuggestions[randomSuggestionIndex]?.path);
                                btnElem.setAttribute('data-redirect', filteredSuggestions[randomSuggestionIndex]?.value);
                                btnElem.textContent = randomSuggestionValue;
    
                            } else {
    
                                let newRandomSuggestionValue = randomSuggestionValue;
    
                                while (currentValues.includes(newRandomSuggestionValue)) {
                                    const newData = handleGenerateRandom(filteredSuggestions);
                                    randomSuggestionIndex = newData?.index;
                                    newRandomSuggestionValue = newData?.value;
                                }
    
                                imgElem.setAttribute('src', filteredSuggestions[randomSuggestionIndex]?.img);
                                imgElem.setAttribute('alt', filteredSuggestions[randomSuggestionIndex]?.alt);
                                btnElem.setAttribute('href', filteredSuggestions[randomSuggestionIndex]?.path);
                                btnElem.setAttribute('data-redirect', filteredSuggestions[randomSuggestionIndex]?.value);
                                btnElem.textContent = newRandomSuggestionValue;
    
                            }
                        }
                    }
                }
            }

        } else if (selectedTopic === 'product' || selectedTopic === 'info' || selectedTopic === 'other') {

            handleFetchComponent('/components/faq.html', otherSuggestions, true);

        } else if (selectedTopic === 'feedback') {

            handleFetchComponent('/components/reviews.html', carousel);
            feedbackSuggestions.classList.remove('d-none');
            feedbackSuggestions.classList.add('d-block');

        } else {
            throw new Error("The option is not valid");
        }
    }
}

// Handle generate random index and get its value in the suggestions array
function handleGenerateRandom(filteredSuggestions) {

    if (filteredSuggestions && filteredSuggestions.length > 0) {
        const randomSuggestionIndex = Math.floor(Math.random() * filteredSuggestions.length);
        const randomSuggestionId = filteredSuggestions[randomSuggestionIndex]?.value;
        const randomSuggestionValue = document.querySelector(`option[value=${randomSuggestionId}]`)?.textContent;
    
        return {
            index: randomSuggestionIndex,
            value: randomSuggestionValue
        }
    }
}

// Call the functions and add the event handlers on load of the page
window.addEventListener("load", () => {
    // handle personalized suggestions on form submit
    form.addEventListener('submit', handleSuggestions);
})