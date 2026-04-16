// Handle scroll to elem by taking into account the navbar height
export default function scrollToElem(elem) {
    if (elem) {
        const navbarHeight = document.querySelector('.navbar')?.clientHeight;
        const elemToTop = window.scrollY + elem?.getBoundingClientRect()?.top;
        if (navbarHeight && elemToTop) {
            const targetPosition = elemToTop - navbarHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            })
        }
    }
}