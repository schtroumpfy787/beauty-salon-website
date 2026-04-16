// Handle prefill contact form with requested service 
export default function handlePrefillForm(params) {
    const apptOption = document.querySelector('.contact__contactTopic option[value="appt"]');
    const hiddenSelectOptions = document.querySelectorAll('.contact__hiddenSelect option');
    const currentlySelectedOption = document.querySelector('.contact__contactTopic option[selected]');
    if (params && apptOption && hiddenSelectOptions && hiddenSelectOptions.length > 0) {
        const serviceId = params.slice(params.indexOf('=') + 1);
        if (serviceId) {
            currentlySelectedOption ? currentlySelectedOption.removeAttribute('selected') : null;
            apptOption.setAttribute("selected", "");
            hiddenSelectOptions.forEach(opt => opt.value === serviceId ? opt.setAttribute("selected", true) : null);
        }
    } 
}



