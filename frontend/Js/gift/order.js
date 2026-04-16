//////////////////////////// STEPS OF GIFT CARD PURCHASE  ////////////////////////////

// Imports
import { setUpSlideInAnimation } from './../utils/slideInObserver.js';
// HTML Elements
const purchaseSection = document.querySelector('.giftpage__purchase');
const closeBtn = document.querySelector('.giftpage__closeConditions');
const orderBtn = document.querySelector('.giftpage__orderBtn');
const conditions = document.querySelector('.giftpage__conditions');
const checkbox = document.querySelector('.giftpage__checkConditions');
const confirmBtn = document.querySelector('.giftpage__acceptConditions');

///////// START OF THE JS ///////

// handle access to the terms of sale
function handlePurchaseStepOne() {
    conditions ? conditions.classList.remove('d-none') : null;
}

// handle dismiss terms of sale and cancel
function handleCancelPurchase() {
    conditions ? conditions.classList.add('d-none') : null;
}

// handle checkbox and submit button states
function handleToggleBtnState() {
    if (checkbox && checkbox.checked && confirmBtn) {
        confirmBtn.removeAttribute('disabled');
    } else if (confirmBtn) {
        confirmBtn.setAttribute('disabled', true);
    }
}
// handle accept terms of sale and proceed
function handlePurchaseStepTwo(e) {
    e.preventDefault();
    if (checkbox && checkbox.checked) {
        const msg = document.createElement('p');
        msg.textContent = 'Votre commande a été enregistrée. Vous serez recontactée par email pour finaliser le paiement.';
        msg.classList.add('alert', 'alert-success', 'mt-3');
        confirmBtn.parentElement.appendChild(msg);
        confirmBtn.setAttribute('disabled', true);
    }
}

// Call the functions and add the event handlers on load of the page
window.addEventListener('load', () => {
    // handle accept terms of sale
    orderBtn ? orderBtn.addEventListener('click', handlePurchaseStepOne) : null;
    // handle cancel / dismiss terms of sale
    closeBtn ? closeBtn.addEventListener('click', handleCancelPurchase) : null;
    // handle button disabled state
    checkbox ? checkbox.addEventListener('change', handleToggleBtnState) : null;
    // handle redirect to the third party for the payment
    confirmBtn ? confirmBtn.addEventListener('click', handlePurchaseStepTwo) : null;
    // handle slide in animation
    purchaseSection ? setUpSlideInAnimation(purchaseSection, 'bottom') : null;
  })
