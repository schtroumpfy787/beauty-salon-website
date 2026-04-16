// Handle get scroll direction
let prevScroll = 0;

export default function FnScrollDirection(scrollY) {
    if (scrollY) {
        let currentScroll = scrollY;
        if (currentScroll > 0 && currentScroll >= prevScroll) {
            prevScroll = currentScroll;
            return "down";
        } else {
            prevScroll = currentScroll;
            return "up";
        };
    }
};