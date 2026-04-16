//////////////////////////// HANDLE APPOINTMENT SELECTS ////////////////////////////

// Imports
import handlePrefillForm from './../utils/prefillForm.js';
import { setUpSlideInAnimation } from './../utils/slideInObserver.js';
// HTML Elements
const contactSection = document.querySelector('.contact');
const form = document.querySelector('.contact__form');
const select = document.querySelector('.contact__contactTopic');
const hiddenSelect = document.querySelector('.contact__hiddenSelect');
const apptFormHidden = document.querySelector('.contact__apptFormHidden');
const textarea = document.querySelector('.contact__form textarea');
const formSummary = document.querySelector('.contact__formSummary');
const formTopic = document.querySelector('.contact__formTopic');
const formMessage = document.querySelector('.contact__formMessage');
const formServices = document.querySelector('.contact__formServices');
const formTime = document.querySelector('.contact__formTime');
const addBtn = document.querySelector('.contact__addBtn');

///////// START OF THE JS ////////

// Handle page display after valid form submission
function handleValidForm(e) {

	e.preventDefault();

	if (form && formSummary) {
		form.classList.remove('d-flex');
		form.classList.add('d-none');
		formSummary.classList.remove('d-none');
		formSummary.classList.add('d-flex');
	}

	if (textarea && select && formTopic && formMessage && formTime) {
		const submittedMessageContent = textarea?.value;
		const submittedMessageTopic = select?.selectedOptions[0]?.textContent;
		const submittedMessageDate = new Date().toLocaleString('fr', {
			hour: 'numeric',
			minute: 'numeric',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			weekday: 'long',
		});

		const apptRequests = document.querySelectorAll('.contact__hiddenSelect');
		if (submittedMessageTopic === 'Demande de rendez-vous' && formServices && apptRequests && apptRequests.length > 0) {
			formServices.classList.remove('d-none');
			apptRequests.forEach(select => {
				const li = document.createElement('li');
				li.textContent = select?.selectedOptions[0]?.textContent;
				formServices.appendChild(li);
			})
		}
	
		formTopic.textContent += submittedMessageTopic;
		formTime.textContent += submittedMessageDate;
		formMessage.textContent = `"${submittedMessageContent}"`;

		// scroll to the top of the page
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth'
		})
	}
}

// Handle invalid form submission
function handleInvalidForm(e) {
	e.preventDefault();
	form.classList.add('was-validated');
}

// Handle form display depending on the user selection // CHANGE OR IMPROVE THIS ONE
function handleApptFormDisplay() {
	const currentSelection = select?.selectedOptions[0]?.value;
	if (currentSelection && apptFormHidden) {
		if (currentSelection === 'appt') {
			apptFormHidden.classList.remove('d-none');
			apptFormHidden.setAttribute('required', '');
		} else {
			apptFormHidden.classList.add('d-none');
			apptFormHidden.removeAttribute('required', '');
		}
	}
}

// Handle request booking more than one service
function handleBookMoreServices() {
	// create the wrapper
	const wrapper = document.createElement('div');
	wrapper.classList.add('contact__apptFormWrapper');
	wrapper.classList.add('mt-3');

	if (hiddenSelect && addBtn) {
		// create the select clone
		const newSelect = hiddenSelect?.cloneNode(true);
		const numberOfSelect = document.querySelectorAll('.contact__apptFormHidden select').length;
		newSelect.setAttribute('id', `appointment${numberOfSelect}`);

		// create the trash icon
		const trashIconWrapper = document.createElement('button');
		const trashIcon = document.createElement('i');
		trashIcon.classList.add('fa-solid', 'fa-trash-can');
		trashIconWrapper.appendChild(trashIcon);
		trashIconWrapper.setAttribute('type', 'button');
		trashIconWrapper.addEventListener('click', e => handleDeleteService(e));

		// put everything together and add to the dom
		wrapper.appendChild(newSelect);
		wrapper.appendChild(trashIconWrapper);
		addBtn.before(wrapper);

		const allSelects = document.querySelectorAll('.contact__hiddenSelect');
		if (allSelects && allSelects.length > 0) {
			allSelects.forEach(select =>
				select.addEventListener('change', () => handleDisabledOptions(allSelects))
			);
			handleDisabledOptions(allSelects);
		}
	}
}


// Handle disabled select options 
function handleDisabledOptions(getAllSelects) {
	const allOptions = document.querySelectorAll('.contact__apptFormHidden option');
	
	if (allOptions && allOptions.length > 0 && getAllSelects && getAllSelects.length > 0) {
		allOptions.forEach(option => option.removeAttribute('disabled'));
		getAllSelects.forEach((select, i) => {
			let currentOptionValue = select?.selectedOptions[0]?.value;
			const options = document.querySelectorAll(`option[value=${currentOptionValue}]`);
			if (options && options.length > 0) {
				options.forEach((opt, index) => {
					if (index !== i) {
						opt.setAttribute('disabled', true);
					}
				});
			}
		});
	}
}

// Handle delete requested service
function handleDeleteService(e) {
	const elemToDelete = e.currentTarget.parentElement;
	elemToDelete ? elemToDelete.remove() : null;
	const allSelects = document.querySelectorAll('.contact__hiddenSelect');
	allSelects && allSelects.length > 0 ? handleDisabledOptions(allSelects) : null;
}

// Call the functions and add the event handlers on load of the page
window.addEventListener("load", () => {
	// handle prefill form
	handlePrefillForm(window?.location?.search);
    // handle form display depending on the select selected option on load and change
	handleApptFormDisplay();
	select ? select.addEventListener('change', handleApptFormDisplay) : null;
	// handle form submit and creation of the request summary page
	 form ? form.addEventListener(
		'submit',
		e => !form.reportValidity() ? handleInvalidForm(e) : handleValidForm(e)
	) : null;
	// handle request to book more than one service
	addBtn ? addBtn.addEventListener('click', handleBookMoreServices) : null;
	// handle slide in animation
	setUpSlideInAnimation(contactSection, 'bottom');
})

