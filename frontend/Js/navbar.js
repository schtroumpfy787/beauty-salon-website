//////////////////////////// NAVBAR ////////////////////////////

// Imports
import scrollToElem from './utils/scrollToElem.js';
import { search_params } from './data/searchData.js';
import handleFetchComponent from './utils/fetchComponent.js';

// HTML Elements
const root = document.querySelector(':root');
const navbarWrapper = document.querySelector('#nav');

///////// START OF THE JS ////////

// Handle focus and blur states of the search bar
function focusState() {
    const focusedElem = document.querySelector('#searchInput');
    const toggleClassElem = document.querySelector('#searchGroup');

    if (focusedElem && toggleClassElem) {
        focusedElem.addEventListener('focus', () => {
            toggleClassElem.classList.add('navbar__input-group--focus');
            handleToggleDropdown();
            handleNavbarHeight();
        });
        focusedElem.addEventListener('blur', (e) => {
            // if the target is a dropdown link return (do not loose the focus) if not it won't redirect
            if (e.relatedTarget?.hasAttribute('href')) return;
            toggleClassElem.classList.remove('navbar__input-group--focus');
            handleToggleDropdown();
        });
    }
}

// Handle navbar height
function handleNavbarHeight() {
    const navMenu = document.querySelector('#navMenu');
    const searchBar = document.querySelector('#searchBar');
    if (navMenu && searchBar && !navMenu.classList.contains('show') && !searchBar.classList.contains('show')) {
        const navbarHeightRem = document.querySelector('.navbar')?.offsetHeight / 16;
        navbarHeightRem && navbarHeightRem !== 0 ? root.style.setProperty('--navbarHeight', `${navbarHeightRem}rem`) : null;
    }
}

// Handle dropdown and navbar overflow
function handleOverflow() {
    // the elements that can possibly overflow
    const searchBarDropdown = document.querySelector('.navbar__search-dropdown');
    const navbarMenu = document.querySelector('.navbar__menu');
    // the elements that can possibly trigger an overflow
    const navLinks = document.querySelectorAll('.navbar__menu .dropdown');
    const navbarInput = document.querySelector('.navbar__input');

    if (searchBarDropdown && navbarMenu && navLinks && navLinks.length > 0 && navbarInput) {
        navLinks.forEach(a => a.addEventListener('click', () => {
            checkViewportOverflow(navbarMenu);
            checkViewportOverflow(searchBarDropdown);
        }));
        navbarInput.addEventListener('change', () => {
            checkViewportOverflow(searchBarDropdown);
            checkViewportOverflow(navbarMenu);
        });
        window.addEventListener('resize', () => {
            checkViewportOverflow(searchBarDropdown);
            checkViewportOverflow(navbarMenu);
        });
    }

    function checkViewportOverflow(elem) {
        if (elem) {
            const distanceFromTopViewport = elem?.getBoundingClientRect().top;
            const elemCurrentHeight = elem?.getBoundingClientRect().height;
            const elemMaxHeight = window?.innerHeight - distanceFromTopViewport;
            if (elemCurrentHeight > elemMaxHeight) {
                elem.style.maxHeight = `${elemMaxHeight}px`;
                elem.style.overflowY = 'auto';
            } else {
                elem.style.maxHeight = 'none';
                elem.style.overflowY = 'initial';
            }
        }
    }
}

// Handle link click and eventual redirection
function handleLinkClick(link, e) {

    const searchInput = document.querySelector('.navbar__input');
    const dropdownList = document.querySelector('.navbar__search-dropdown ul');
    
    if (searchInput && dropdownList) {
        searchInput.value = '';
        dropdownList.innerHTML = '';
        handleToggleDropdown();
    }

    if (link) {
        const path = new URL(link?.href)
            ?.pathname
            .slice(0, -4)
            .replace(/\W*/g, '');

        // the data-redirect attribute is set to 'null' it means that there is no specific target (just a page)
        // the user is already on the page he requested so just scroll to the top of that one
        if (link?.dataset?.redirect === 'null' && window?.location?.href?.includes(path)) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return;
        }
        // the user is already on the page he requested and there is a specific target
        // find the target and scroll to it
        if (window.location.href.includes(path)) {
            e.preventDefault();
            const target = document.getElementById(e.target.dataset.redirect || link.href.slice(link.href.indexOf('=') + 1));
            if (target) scrollToElem(target);
            return false;
        }
        // the user is not on the page he requested so redirect to it
        window.location = link.href;
    }
}

// Handle search bar suggestions
function handleSearchBar(e) {

    const userInput = e?.target?.value;
    const sanitizedInput = userInput ? encodeURIComponent(userInput.trim().toLowerCase()) : null;
    const dropdownList = document.querySelector('.navbar__search-dropdown ul');

    // if there is no search parameter ...
    if (sanitizedInput === '' && dropdownList) {
        dropdownList.innerHTML = '';
        handleToggleDropdown();
        return;
    }

    if (sanitizedInput && dropdownList) {
        // if the search parameter is not null search for corresponding keywords in the list
        const suggestions = search_params.filter(param => {
            const { query } = param;
            const keywordIndex = query.findIndex(word => word.toLowerCase().includes(sanitizedInput) || sanitizedInput.includes(word.toLowerCase()));
            return keywordIndex !== -1;
        });
    
        // clear the dropdown
        dropdownList.innerHTML = '';
        
        // create the dropdown content
        suggestions && suggestions.length > 0 && suggestions.map(opt => {
            const dropdownItem = document.createElement('li');
            const dropdownLink = document.createElement('a');
            dropdownLink.textContent = opt.sentence;
            dropdownLink.setAttribute('href', opt.path);
            dropdownLink.setAttribute('data-redirect', opt.redirect);
            dropdownLink.classList.add('list-group-item', 'list-group-item-action');
            dropdownLink.addEventListener('click', (e) => handleLinkClick(dropdownLink, e));
            dropdownItem.appendChild(dropdownLink);
            dropdownList.appendChild(dropdownItem);
        })
        handleToggleDropdown();
    }
}

// Handle search bar dropdown toggle
function handleToggleDropdown() {

    const dropdown = document.querySelector('.navbar__search-dropdown');
    const dropdownList = document.querySelector('.navbar__search-dropdown ul');
    const toggleClassElem = document.querySelector('#searchGroup');
    const input = document.querySelector('.navbar__input-group');

    if (dropdown && dropdownList && toggleClassElem && input) {
        if (dropdownList?.children?.length > 0 && input?.classList?.contains('navbar__input-group--focus')) {
            // there are some suggestions available and the search bar is focused - show the dropdown
            dropdown.classList.remove('d-none');
            toggleClassElem.classList.add('navbar__input-group--dropdown');
        } else {
            // there are no suggestions available or the search bar is not focused - hide the dropdown
            dropdown.classList.add('d-none');
            toggleClassElem.classList.remove('navbar__input-group--dropdown')
        }
    }
}

// Handle search bar submit
function handleSearchBarSubmit(e) {

    const dropdownList = document.querySelector('.navbar__search-dropdown ul');
    const input = document.querySelector('.navbar__input-group');
    const focusedElem = document.querySelector('#searchInput');

    if (dropdownList && input) {
        if (dropdownList?.children?.length > 0 && dropdownList?.children[0]?.children?.length > 0) {
            // if the user submits without selecting any link, act as if the first list item was selected
            handleLinkClick(dropdownList?.firstElementChild?.firstElementChild, e);
        } else {
            // if the suggestion list is empty, show an error message asking the user to try again
            dropdownList.innerHTML = '';
            const dropdownItem = document.createElement('li');
            dropdownItem.classList.add('list-group-item');
            dropdownItem.textContent = 'Aucun résultat. Veuillez réessayer avec un autre mot clé.';
            dropdownList.appendChild(dropdownItem);
            // trigger focus on the input to show the error message
            focusedElem.focus();
        }
    }
}

function handleQueryParamsParsing() {
    // When the page loads, if there is param in the url, find the corresponding elem and scroll to it
    if (window?.location?.search) {
        const params = window.location.search;
        const targetElem = document.querySelector(`#${params.slice(params.indexOf('=') + 1)}`);
        if (targetElem) scrollToElem(targetElem);
    }
}      

// Call the function and add the event handlers on load of the page
window.addEventListener('load', async () => {
    if (navbarWrapper) {
        // fetch the navbar
        await handleFetchComponent('/components/navbar.html', navbarWrapper);
        // get navbar height in order to apply the correct styling to the surrounding elements on load and resize and on click
        handleNavbarHeight();
        window.addEventListener('resize', handleNavbarHeight);
        // handle overflow of the dropdown and the navmenu
        handleOverflow();
        // add the focus and blur event listeners
        focusState();
        // add redirect click listener to all links in the navbar
        const links = document.querySelectorAll('[data-redirect]');
        links && links.length > 0 ? links.forEach(link => link.addEventListener('click', (e) => handleLinkClick(link, e))) : null;
        // add input and change listeners to the search bar
        const searchBar = document.querySelector('.navbar__input');
        searchBar ? searchBar.addEventListener('input', (e) => handleSearchBar(e)) : null;
        // add click listener to the search bar submit button
        const submitBtn = document.querySelector('.navbar__search-btn');
        submitBtn ? submitBtn.addEventListener('click', (e) => handleSearchBarSubmit(e)) : null;
        // scroll to elem if url contains query params
        handleQueryParamsParsing();

        // once everything is setup, make the page content visible
        document.body.style.visibility = 'visible';
    }
});
