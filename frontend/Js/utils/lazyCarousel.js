// Handle carousel lazy loading
export default function handleCarouselLazyLoading(targetCarousel) {
    if (targetCarousel) {
        const carousel = new bootstrap.Carousel(targetCarousel, {interval: 5000, pause: 'hover', ride: 'carousel'});
        const carouselObserver = new IntersectionObserver(entries => {
            entries.map(entry => {
                if (!entry.isIntersecting) {
                    carousel.pause();
                } else {
                    carousel.cycle();
                }
            }) 
        });
        carouselObserver.observe(targetCarousel);
    }
}