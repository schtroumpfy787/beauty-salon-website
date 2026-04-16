// for dev purpose only - remove for production
export default function handleInactiveLinks() {
    const inactiveLinks = document.querySelectorAll('[data-inactive]');
    if (inactiveLinks && inactiveLinks.length > 0) {
        inactiveLinks.forEach(link => link.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Endpoint under construction - not available yet.');
        }))
    }
}