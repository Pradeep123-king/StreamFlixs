const API_KEY = "9f277be7ee112da663fe5d03057ad949";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";

const requests = {
    fetchTrending: `/trending/all/week?api_key=${API_KEY}&language=en-US`,
    fetchNetflixOriginals: `/discover/tv?api_key=${API_KEY}&with_networks=213`,
    fetchTopRated: `/movie/top_rated?api_key=${API_KEY}&language=en-US`,
    fetchActionMovies: `/discover/movie?api_key=${API_KEY}&with_genres=28`,
    fetchComedyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=35`,
    fetchHorrorMovies: `/discover/movie?api_key=${API_KEY}&with_genres=27`,
    fetchRomanceMovies: `/discover/movie?api_key=${API_KEY}&with_genres=10749`,
    fetchDocumentaries: `/discover/movie?api_key=${API_KEY}&with_genres=99`,
    fetchSciFi: `/discover/movie?api_key=${API_KEY}&with_genres=878`,
    fetchMystery: `/discover/movie?api_key=${API_KEY}&with_genres=9648`,
    fetchAnimation: `/discover/movie?api_key=${API_KEY}&with_genres=16`,
    fetchAdventure: `/discover/movie?api_key=${API_KEY}&with_genres=12`,
    fetchCrime: `/discover/movie?api_key=${API_KEY}&with_genres=80`,
    fetchTVShows: `/discover/tv?api_key=${API_KEY}&language=en-US`,
    fetchMovies: `/discover/movie?api_key=${API_KEY}&language=en-US`,
    fetchIndianMovies: `/discover/movie?api_key=${API_KEY}&with_original_language=hi&sort_by=release_date.desc&year=2024`,
    fetchTrendingMoviesDay: `/trending/movie/day?api_key=${API_KEY}&language=en-US`,
    fetchKannadaMovies: `/discover/movie?api_key=${API_KEY}&with_original_language=kn&primary_release_year=2024&sort_by=primary_release_date.desc`,
    fetchTeluguMovies: `/discover/movie?api_key=${API_KEY}&with_original_language=te&primary_release_year=2024&sort_by=primary_release_date.desc`,
    fetchTamilMovies: `/discover/movie?api_key=${API_KEY}&with_original_language=ta&primary_release_year=2024&sort_by=primary_release_date.desc`,
    fetchNewComedy: `/discover/movie?api_key=${API_KEY}&with_genres=35&primary_release_year=2024&sort_by=popularity.desc`,
};

let featuredMovies = [];
let currentHeroIndex = 0;

function selectMovie(movie) {
    if (!movie) return;

    // 1. Move to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 2. Add to featured list if not there
    let index = featuredMovies.findIndex(m => (m.id && m.id === movie.id) || (m.title && m.title === movie.title));
    if (index === -1) {
        featuredMovies.unshift(movie); // Put at start
        currentHeroIndex = 0;
    } else {
        currentHeroIndex = index;
    }

    // 3. Update Hero Visually
    const hero = document.getElementById('hero');
    const rowsContainer = document.getElementById('rows-container');
    if (hero) hero.style.display = 'flex';

    // If we are looking at a specific grid/page, we should probably return to home
    // but the user said "direct open this in primary section"
    // So let's make sure strings are updated
    updateHeroDisplay(movie);

    // 4. Update the My List button state in the hero
    const myListBtn = document.getElementById('btn-add');
    const currentList = JSON.parse(localStorage.getItem('netflix_clone_mylist') || '[]');
    const isAdded = currentList.some(m => (m.id && m.id === movie.id) || (m.title && m.title === movie.title));
    updateMyListButton(myListBtn, isAdded);
}

const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.getElementById('close-modal');
const landingHeader = document.getElementById('header');
const authOverlay = document.getElementById('auth-overlay');
const profileDropdown = document.getElementById('profile-dropdown');
const profileIcon = document.getElementById('icon-profile');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const loadingScreen = document.getElementById('loading-screen');
const profileSelection = document.getElementById('profile-selection');
const addProfileScreen = document.getElementById('add-profile-screen');
const newProfileNameInput = document.getElementById('new-profile-name');

// Page Transitions
function showHomePage() {
    const profileName = localStorage.getItem('netflix_clone_profile') || 'User';
    const activeProfileNameEl = document.getElementById('active-profile-name');
    if (activeProfileNameEl) activeProfileNameEl.textContent = profileName;

    // Show loading screen first
    loadingScreen.style.display = 'flex';

    setTimeout(() => {
        document.getElementById('landing-page').style.display = 'none';
        document.getElementById('profile-selection').style.display = 'none';
        landingHeader.style.display = 'none';

        const homePage = document.getElementById('home-page');
        homePage.style.display = 'block';
        homePage.classList.add('fade-in');

        loadingScreen.style.display = 'none';
        loadingScreen.style.display = 'none';
        updateProfileDropdown(); // Update dropdown with other profiles
        loadPage('nav-home');
    }, 800);
}

function showLoginPage(email = '') {
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('profile-selection').style.display = 'none';
    document.getElementById('home-page').style.display = 'none';
    landingHeader.style.display = 'flex';
    landingHeader.classList.add('landing-header');
    authOverlay.style.display = 'flex';
    document.body.style.backgroundColor = '#000';

    // Explicitly set Sign In state when showing login page
    resetAuthState();

    if (email) {
        const emailInput = document.getElementById('email');
        if (emailInput) emailInput.value = email;
    }
}

function resetAuthState() {
    const authTitle = document.getElementById('auth-title');
    const mainAuthBtn = document.getElementById('main-auth-btn');
    const signinToggle = document.getElementById('signin-toggle-container');
    const signupToggle = document.getElementById('signup-toggle-container');
    const nameField = document.getElementById('name-field');
    const passwordField = document.getElementById('password-field');
    const confirmField = document.getElementById('confirm-password-field');
    const authExtras = document.getElementById('auth-extras');

    if (authTitle) authTitle.textContent = 'Login';
    if (mainAuthBtn) mainAuthBtn.textContent = 'Login';
    if (signinToggle) signinToggle.style.display = 'block';
    if (signupToggle) signupToggle.style.display = 'none';
    if (nameField) nameField.style.display = 'none';
    if (passwordField) passwordField.style.display = 'block';
    if (confirmField) confirmField.style.display = 'none';
    if (authExtras) authExtras.style.display = 'block';
}

function showSignupPage(email = '') {
    showLoginPage();

    const authTitle = document.getElementById('auth-title');
    const mainAuthBtn = document.getElementById('main-auth-btn');
    const signinToggle = document.getElementById('signin-toggle-container');
    const signupToggle = document.getElementById('signup-toggle-container');
    const nameField = document.getElementById('name-field');
    const confirmField = document.getElementById('confirm-password-field');
    const authExtras = document.getElementById('auth-extras');
    const emailInput = document.getElementById('email');

    if (authTitle) authTitle.textContent = 'Create Account';
    if (mainAuthBtn) mainAuthBtn.textContent = 'Create Account';
    if (signinToggle) signinToggle.style.display = 'none';
    if (signupToggle) signupToggle.style.display = 'block';
    if (nameField) nameField.style.display = 'block';
    if (confirmField) confirmField.style.display = 'block';
    if (authExtras) authExtras.style.display = 'block';

    if (email && emailInput) {
        emailInput.value = email;
    }
}

function showProfileSelection() {
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('home-page').style.display = 'none';
    landingHeader.style.display = 'none';
    authOverlay.style.display = 'none';
    document.getElementById('profile-selection').style.display = 'flex';
}

// Sign In / Sign Up Toggling
const showSignup = document.getElementById('show-signup');
const showSignin = document.getElementById('show-signin');
const forgotPasswordLink = document.getElementById('forgot-password-link');
const authTitle = document.getElementById('auth-title');
const mainAuthBtn = document.getElementById('main-auth-btn');
const signinToggle = document.getElementById('signin-toggle-container');
const signupToggle = document.getElementById('signup-toggle-container');
const nameField = document.getElementById('name-field');
const confirmField = document.getElementById('confirm-password-field');
const authExtras = document.getElementById('auth-extras');

if (showSignup) {
    showSignup.onclick = (e) => {
        e.preventDefault();
        authTitle.textContent = 'Create Account';
        mainAuthBtn.textContent = 'Create Account';
        signinToggle.style.display = 'none';
        signupToggle.style.display = 'block';
        if (nameField) nameField.style.display = 'block';
        if (confirmField) confirmField.style.display = 'block';
        if (authExtras) authExtras.style.display = 'block';
    };
}

if (showSignin) {
    showSignin.onclick = (e) => {
        e.preventDefault();
        authTitle.textContent = 'Login';
        mainAuthBtn.textContent = 'Login';
        signinToggle.style.display = 'block';
        signupToggle.style.display = 'none';
        if (nameField) nameField.style.display = 'none';
        if (confirmField) confirmField.style.display = 'none';
        if (authExtras) authExtras.style.display = 'block';
    };
}

if (forgotPasswordLink) {
    forgotPasswordLink.onclick = (e) => {
        e.preventDefault();
        authTitle.textContent = 'Reset Password';
        mainAuthBtn.textContent = 'Save and Login';
        signinToggle.style.display = 'none';
        signupToggle.style.display = 'block'; // Show "Already have an account? Sign in now"
        if (nameField) nameField.style.display = 'none';
        if (confirmField) confirmField.style.display = 'block';
        if (authExtras) authExtras.style.display = 'none'; // Hide OR and sign-in code
    };
}

// FAQ Logic
document.querySelectorAll('.faq-question').forEach(button => {
    button.onclick = () => {
        const answer = button.nextElementSibling;
        const icon = button.querySelector('i');
        const currentlyShown = answer.classList.contains('show');

        document.querySelectorAll('.faq-answer.show').forEach(el => el.classList.remove('show'));
        document.querySelectorAll('.faq-question i').forEach(el => el.className = 'fas fa-plus');

        if (!currentlyShown) {
            answer.classList.add('show');
            icon.className = 'fas fa-times';
        }
    };
});

async function renderLandingTrending() {
    const movies = await fetchData(requests.fetchTrending);
    const container = document.getElementById('landing-trending-container');
    if (!container) return;
    container.innerHTML = '';

    // 1. Define Custom ID Breaking Bad
    const extraMovie = {
        custom: true,
        title: "Breaking Bad",
        overview: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
        backdrop_path: "https://image.tmdb.org/t/p/original/tsRy63Mu5CU8etx134mpIqIQQpX.jpg",
        poster_path: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
        vote_average: 9.5,
        id: 'custom-breaking-bad'
    };

    // 2. Find Stranger Things
    let strangerThings = movies.find(m => m.id === 66732 || m.name === "Stranger Things");
    if (!strangerThings) {
        strangerThings = {
            id: 66732,
            name: "Stranger Things",
            overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
            backdrop_path: "/56v2KjBlU4XaOv9rVYkJu64MILb.jpg",
            poster_path: "/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
            vote_average: 8.6
        };
    }

    // 3. Define Squid Game Manual
    const squidGame = {
        custom: true,
        id: 'squid-game-manual',
        title: "Squid Game",
        overview: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes.",
        backdrop_path: "https://image.tmdb.org/t/p/original/oaGvjB0DvdhXhOKs752z89H0AgD.jpg",
        poster_path: "https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg",
        vote_average: 8.4
    };

    // 4. Filter duplicates and construct final list
    const otherMovies = movies.filter(m => m.id !== 66732 && m.name !== "Stranger Things" && m.id !== 'custom-breaking-bad' && m.name !== "Breaking Bad" && m.title !== "Squid Game");
    const finalMovies = [extraMovie, strangerThings, squidGame, ...otherMovies].slice(0, 10);

    // 4. Render
    finalMovies.forEach((movie, index) => {
        const div = document.createElement('div');
        div.className = 'trending-item';

        const posterUrl = movie.custom ? movie.poster_path : `${POSTER_BASE_URL}${movie.poster_path || movie.backdrop_path}`;
        const title = movie.title || movie.name;

        div.innerHTML = `
            <span class="trending-number">${index + 1}</span>
            <img src="${posterUrl}" alt="${title}">
        `;

        // Make clickable
        div.onclick = () => showMovieDetails(movie, false);

        container.appendChild(div);
    });
}

document.getElementById('btn-login-entry').onclick = () => showLoginPage();
const btnSignupEntry = document.getElementById('btn-signup-entry');
if (btnSignupEntry) {
    btnSignupEntry.onclick = () => showSignupPage();
}

document.querySelectorAll('.landing-email-form').forEach(form => {
    form.onsubmit = (e) => {
        e.preventDefault();
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput ? emailInput.value : '';
        showLoginPage(email);
    };
});

loginForm.onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const title = authTitle.textContent;
    const password = document.getElementById('password').value;
    const confirmElement = document.getElementById('confirm-password');
    const confirm = confirmElement ? confirmElement.value : '';

    // Clear previous errors
    const existingError = loginForm.querySelector('.auth-error-message');
    if (existingError) existingError.remove();

    function showError(msg) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'auth-error-message';
        errorDiv.style.color = '#e87c03';
        errorDiv.style.fontSize = '14px';
        errorDiv.style.marginBottom = '15px';
        errorDiv.textContent = msg;
        loginForm.insertBefore(errorDiv, loginForm.firstChild);
    }

    if (title === 'Create Account') {
        if (password !== confirm) {
            showError("Passwords do not match!");
            return;
        }
        // Save the account (simulated)
        localStorage.setItem('netflix_clone_email', email.toLowerCase());
        localStorage.setItem('netflix_clone_password', password);

        // After signup, go to sign in page as requested
        resetAuthState();
        document.getElementById('email').value = email;
        document.getElementById('password').value = '';
        return;
    }

    if (title === 'Reset Password') {
        if (password !== confirm) {
            showError("Passwords do not match!");
            return;
        }
        localStorage.setItem('netflix_clone_password', password);
        alert("Password reset successful! Logging you in...");
    }

    // Bypass validation: Accept any dummy email and password for demo purposes
    if (email) {
        localStorage.setItem('netflix_clone_email', email);
    }
    localStorage.setItem('netflix_clone_auth', 'true');
    showProfileSelection();
    return;

};

// Profile Selection Logic (Delegated)
const profileList = document.getElementById('profile-list');
if (profileList) {
    profileList.onclick = (e) => {
        const card = e.target.closest('.profile-card');
        if (!card) return;

        const profileName = card.getAttribute('data-profile');
        const selectedImg = card.querySelector('img').src;

        localStorage.setItem('netflix_clone_auth', 'true');
        localStorage.setItem('netflix_clone_profile', profileName);
        localStorage.setItem('netflix_clone_profile_img', selectedImg);

        const profileIconImg = document.querySelector('#icon-profile img');
        if (profileIconImg) profileIconImg.src = selectedImg;

        showHomePage();
    };
}

// StreamFlix Details
const streamFlixColors = ['#e50914', '#00a8e1', '#e2b714', '#2bad0b', '#8a2be2', '#3357ff', '#ff5733'];

function getStreamFlixSvg(bgColor) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="${bgColor}"/><circle cx="35" cy="35" r="5" fill="white"/><circle cx="65" cy="35" r="5" fill="white"/><path d="M30 65 Q50 80 70 65" stroke="white" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Add Profile Functionality
const btnAddProfile = document.getElementById('btn-add-profile');
if (btnAddProfile) {
    btnAddProfile.onclick = () => {
        profileSelection.style.display = 'none';
        addProfileScreen.style.display = 'flex';
        newProfileNameInput.value = '';
        newProfileNameInput.focus();

        const randomColor = streamFlixColors[Math.floor(Math.random() * streamFlixColors.length)];
        const avatarUrl = getStreamFlixSvg(randomColor);
        const previewAvatar = document.querySelector('.add-profile-avatar');
        const previewImg = previewAvatar ? previewAvatar.querySelector('img') : null;

        if (previewAvatar && previewImg) {
            previewAvatar.style.backgroundColor = randomColor;
            previewImg.src = avatarUrl;
        }
    };
}

const btnCancelAdd = document.getElementById('btn-cancel-add');
if (btnCancelAdd) {
    btnCancelAdd.onclick = () => {
        addProfileScreen.style.display = 'none';
        profileSelection.style.display = 'flex';
    };
}

const btnSaveProfile = document.getElementById('btn-save-profile');
if (btnSaveProfile) {
    btnSaveProfile.onclick = () => {
        const name = newProfileNameInput.value.trim();
        if (!name) {
            alert("Please enter a profile name.");
            return;
        }

        const newCard = document.createElement('div');
        newCard.className = 'profile-card';
        newCard.setAttribute('data-profile', name);

        // Use the image from the preview
        const previewAvatar = document.querySelector('.add-profile-avatar');
        const previewImg = previewAvatar.querySelector('img');
        const avatarUrl = previewImg.src;
        const avatarBg = previewAvatar.style.backgroundColor;

        newCard.innerHTML = `
            <div class="profile-avatar" style="background-color: ${avatarBg};">
                <img src="${avatarUrl}" alt="${name}">
            </div>
            <span class="profile-name">${name}</span>
        `;

        profileList.insertBefore(newCard, btnAddProfile);

        addProfileScreen.style.display = 'none';
        profileSelection.style.display = 'flex';
    };
}

const handleLogout = () => {
    localStorage.removeItem('netflix_clone_auth');
    localStorage.removeItem('netflix_clone_profile');
    localStorage.removeItem('netflix_clone_profile_img');
    // DO NOT remove email and password so user can sign in again
    location.reload();
};

if (logoutBtn) logoutBtn.onclick = handleLogout;

const accountLogoutBtn = document.getElementById('account-logout-btn');
if (accountLogoutBtn) accountLogoutBtn.onclick = handleLogout;

// App UI Logic
const appHeader = document.getElementById('app-header');
window.onscroll = () => {
    if (window.scrollY > 50) appHeader?.classList.add('scrolled');
    else appHeader?.classList.remove('scrolled');
};

const searchToggle = document.getElementById('search-toggle');
const searchBox = document.querySelector('.search-box');
const searchInput = document.getElementById('search-input');
const searchClear = document.getElementById('search-clear');

if (searchToggle) {
    searchToggle.onclick = (e) => {
        searchBox.classList.toggle('active');
        if (searchBox.classList.contains('active')) {
            searchInput.focus();
        } else {
            searchInput.value = '';
            if (searchClear) searchClear.style.display = 'none';
            const activeNav = document.querySelector('.nav-links a.active') || { id: 'nav-home' };
            loadPage(activeNav.id);
        }
    };
}

if (searchClear) {
    searchClear.onclick = () => {
        searchInput.value = '';
        searchClear.style.display = 'none';
        searchInput.focus();
        const activeNav = document.querySelector('.nav-links a.active') || { id: 'nav-home' };
        loadPage(activeNav.id);
    };
}

if (searchInput) {
    let searchTimeout;
    searchInput.oninput = (e) => {
        const query = e.target.value.trim();

        // Show/hide clear button
        if (searchClear) {
            searchClear.style.display = query.length > 0 ? 'block' : 'none';
        }

        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async () => {
            if (query.length > 2) {
                const searchUrl = `/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`;
                document.getElementById('hero').style.display = 'none';
                await renderGrid(`Results for "${query}"`, searchUrl);
            } else if (query.length === 0) {
                const activeNav = document.querySelector('.nav-links a.active') || { id: 'nav-home' };
                loadPage(activeNav.id);
            }
        }, 500);
    };

    // Close on blur if empty
    searchInput.onblur = () => {
        if (searchInput.value.trim() === '') {
            setTimeout(() => {
                if (document.activeElement !== searchClear) {
                    searchBox.classList.remove('active');
                    if (searchClear) searchClear.style.display = 'none';
                }
            }, 200);
        }
    };
}

async function fetchData(url) {
    try {
        const res = await fetch(`${BASE_URL}${url}`);
        const data = await res.json();
        return data.results;
    } catch (err) {
        return [];
    }
}

function updateHeroDisplay(movie) {
    document.getElementById('hero').style.backgroundImage = movie.custom
        ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("${movie.backdrop_path}")`
        : `url("${IMAGE_BASE_URL}${movie.backdrop_path}")`;

    const titleEl = document.getElementById('hero-title');
    if (movie.logo_path) {
        titleEl.innerHTML = `<img src="${movie.logo_path}" alt="${movie.title}" class="hero-logo-img" style="max-width: 500px; width: 90%; display: block; margin-bottom: 20px; filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.5));">`;
    } else {
        titleEl.textContent = movie.name || movie.title;
    }

    document.getElementById('hero-description').textContent = movie.overview;
}

async function renderHero() {
    const movies = await fetchData(requests.fetchNetflixOriginals);
    const dailyUpdates = await fetchData(requests.fetchTrendingMoviesDay);
    // Indian movies removed to prevent broken images

    // 2. Find Stranger Things
    let strangerThings = movies.find(m => m.id === 66732 || m.name === "Stranger Things");
    if (!strangerThings) {
        strangerThings = {
            custom: false,
            id: 66732,
            name: "Stranger Things",
            original_name: "Stranger Things",
            overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
            backdrop_path: "/56v2KjBlU4XaOv9rVYkJu64MILb.jpg",
            poster_path: "/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
            vote_average: 8.6
        };
    }

    // 3. Construct Priority List: Stranger Things -> Daily Updates
    const uniqueMovies = [];
    const seenIds = new Set();

    // Custom Priority
    [strangerThings].forEach(m => {
        if (!seenIds.has(m.id)) {
            uniqueMovies.push(m);
            seenIds.add(m.id);
        }
    });

    // Add others (Daily Updates + Originals), strictly filtering for backdrops
    const allOthers = [...dailyUpdates, ...movies];
    allOthers.forEach(m => {
        if (!seenIds.has(m.id) && m.backdrop_path && m.poster_path && m.name !== "Stranger Things") {
            uniqueMovies.push(m);
            seenIds.add(m.id);
        }
    });

    // 4. Set Featured Movies
    featuredMovies = uniqueMovies.slice(0, 10);

    // Safety check if featuredMovies is empty
    if (featuredMovies.length > 0) {
        updateHeroDisplay(featuredMovies[currentHeroIndex]);
    }

    // Attach Hero Button Listeners
    document.getElementById('btn-play').onclick = () => {
        if (featuredMovies[currentHeroIndex]) {
            showMovieDetails(featuredMovies[currentHeroIndex], false);
        }
    };

    const myListBtn = document.getElementById('btn-add');
    if (!featuredMovies[currentHeroIndex]) return;

    // Check initial state
    const currentList = getMyList();
    const isAdded = currentList.some(m => m.id === featuredMovies[currentHeroIndex].id || m.title === featuredMovies[currentHeroIndex].title);
    updateMyListButton(myListBtn, isAdded);

    myListBtn.onclick = () => {
        const currentMovie = featuredMovies[currentHeroIndex];
        const list = getMyList();
        const existingIndex = list.findIndex(m => m.id === currentMovie.id || m.title === currentMovie.title);

        if (existingIndex >= 0) {
            list.splice(existingIndex, 1);
            updateMyListButton(myListBtn, false);
        } else {
            list.push(currentMovie);
            updateMyListButton(myListBtn, true);
        }
        localStorage.setItem('netflix_clone_mylist', JSON.stringify(list));
    };
}

// === My List Functionality ===
function getMyList() {
    return JSON.parse(localStorage.getItem('netflix_clone_mylist') || '[]');
}

function addToMyList(movie) {
    const list = getMyList();
    if (!list.some(m => m.title === movie.title)) {
        list.push(movie);
        localStorage.setItem('netflix_clone_mylist', JSON.stringify(list));
    }
}

function removeFromMyList(movie) {
    let list = getMyList();
    list = list.filter(m => m.title !== movie.title);
    localStorage.setItem('netflix_clone_mylist', JSON.stringify(list));
}

function toggleMyList(movie, buttonElement) {
    const list = getMyList();
    const isPresent = list.some(m => m.title === movie.title);

    if (isPresent) {
        removeFromMyList(movie);
        updateMyListButton(buttonElement, false);
    } else {
        addToMyList(movie);
        updateMyListButton(buttonElement, true);
    }
}

function updateMyListButton(btn, isAdded) {
    if (isAdded) {
        btn.innerHTML = '<i class="fas fa-check"></i> Added';
    } else {
        btn.innerHTML = '<i class="fas fa-star"></i> Favorites';
    }
}


document.getElementById('hero-next').onclick = () => {
    currentHeroIndex = (currentHeroIndex + 1) % featuredMovies.length;
    updateHeroDisplay(featuredMovies[currentHeroIndex]);
    // Reset My List button state for new slide
    const isAdded = getMyList().some(m => m.title === featuredMovies[currentHeroIndex].title);
    updateMyListButton(document.getElementById('btn-add'), isAdded);
};

document.getElementById('hero-prev').onclick = () => {
    currentHeroIndex = (currentHeroIndex - 1 + featuredMovies.length) % featuredMovies.length;
    updateHeroDisplay(featuredMovies[currentHeroIndex]);
    const isAdded = getMyList().some(m => m.title === featuredMovies[currentHeroIndex].title);
    updateMyListButton(document.getElementById('btn-add'), isAdded);
};

async function renderRow(title, url, isLarge = false) {
    const movies = await fetchData(url);
    if (!movies.length) return;
    const container = document.getElementById('rows-container');
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row';
    // Make title clickable
    rowDiv.innerHTML = `
        <h2 class="row-title clickable">${title} <i class="fas fa-chevron-right title-arrow"></i></h2>
        <div class="row-container">
            <div class="row-arrow left"><i class="fas fa-chevron-left"></i></div>
            <div class="row-posters"></div>
            <div class="row-arrow right"><i class="fas fa-chevron-right"></i></div>
        </div>
    `;

    // Title click handler for separate page
    rowDiv.querySelector('.row-title').onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        renderGrid(title, url);
        // Mark current category in nav as inactive if it was home
        document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
    };

    const postersDiv = rowDiv.querySelector('.row-posters');
    movies.forEach(movie => {
        const path = isLarge ? movie.poster_path : movie.backdrop_path;
        if (path) {
            const img = document.createElement('img');
            img.className = isLarge ? 'row-poster row-posterLarge' : 'row-poster';
            img.src = `${IMAGE_BASE_URL}${path}`;
            img.onclick = () => showMovieDetails(movie, false);
            postersDiv.appendChild(img);
        }
    });

    rowDiv.querySelector('.left').onclick = () => postersDiv.scrollBy({ left: -window.innerWidth * 0.7, behavior: 'smooth' });
    rowDiv.querySelector('.right').onclick = () => postersDiv.scrollBy({ left: window.innerWidth * 0.7, behavior: 'smooth' });
    container.appendChild(rowDiv);
}

async function renderTop10Row(title, url) {
    const movies = await fetchData(url);
    if (!movies.length) return;
    const container = document.getElementById('rows-container');
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row top-10-row';
    // Make title clickable
    rowDiv.innerHTML = `
        <h2 class="row-title clickable">${title} <i class="fas fa-chevron-right title-arrow"></i></h2>
        <div class="row-container">
            <div class="row-arrow left"><i class="fas fa-chevron-left"></i></div>
            <div class="row-posters trending-scroll"></div>
            <div class="row-arrow right"><i class="fas fa-chevron-right"></i></div>
        </div>
    `;

    // Title click handler for separate page
    rowDiv.querySelector('.row-title').onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        renderGrid(title, url);
        document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
    };

    const postersDiv = rowDiv.querySelector('.row-posters');
    // 1. Define Custom ID Breaking Bad
    const extraMovie = {
        custom: true,
        title: "Breaking Bad",
        overview: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
        backdrop_path: "https://image.tmdb.org/t/p/original/tsRy63Mu5CU8etx134mpIqIQQpX.jpg",
        poster_path: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
        vote_average: 9.5,
        id: 'custom-breaking-bad'
    };

    // 2. Find Stranger Things
    let strangerThings = movies.find(m => m.id === 66732 || m.name === "Stranger Things");
    if (!strangerThings) {
        strangerThings = {
            id: 66732,
            name: "Stranger Things",
            overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
            backdrop_path: "/56v2KjBlU4XaOv9rVYkJu64MILb.jpg",
            poster_path: "/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
            vote_average: 8.6
        };
    }

    // 3. Define Squid Game Manual
    const squidGame = {
        custom: true,
        id: 'squid-game-manual',
        title: "Squid Game",
        overview: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes.",
        backdrop_path: "https://image.tmdb.org/t/p/original/oaGvjB0DvdhXhOKs752z89H0AgD.jpg",
        poster_path: "https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg",
        vote_average: 8.4
    };

    // 4. Filter duplicates and construct final list
    const otherMovies = movies.filter(m => m.id !== 66732 && m.name !== "Stranger Things" && m.id !== 'custom-breaking-bad' && m.name !== "Breaking Bad" && m.title !== "Squid Game");
    const validMovies = [extraMovie, strangerThings, squidGame, ...otherMovies].filter(m => m.poster_path).slice(0, 10);

    validMovies.forEach((movie, index) => {
        const item = document.createElement('div');
        item.className = 'trending-item';

        const posterUrl = movie.custom ? movie.poster_path : `${IMAGE_BASE_URL}${movie.poster_path}`;

        item.innerHTML = `
            <span class="trending-number">${index + 1}</span>
            <img src="${posterUrl}" alt="${movie.title || movie.name}">
        `;
        item.onclick = () => showMovieDetails(movie, false);
        postersDiv.appendChild(item);
    });

    rowDiv.querySelector('.left').onclick = () => postersDiv.scrollBy({ left: -window.innerWidth * 0.7, behavior: 'smooth' });
    rowDiv.querySelector('.right').onclick = () => postersDiv.scrollBy({ left: window.innerWidth * 0.7, behavior: 'smooth' });
    container.appendChild(rowDiv);
}

async function renderGrid(title, url) {
    const movies = await fetchData(url);
    const container = document.getElementById('rows-container');
    container.innerHTML = `<h1 class="page-title">${title}</h1>`;
    const grid = document.createElement('div');
    grid.className = 'movie-grid';
    movies.forEach(movie => {
        if (movie.poster_path) {
            const item = document.createElement('div');
            item.className = 'grid-item';
            item.innerHTML = `<img src="${POSTER_BASE_URL}${movie.poster_path}" alt="${movie.title}">`;
            item.onclick = () => showMovieDetails(movie, false);
            grid.appendChild(item);
        }
    });
    container.appendChild(grid);
}

async function loadPage(id) {
    const container = document.getElementById('rows-container');
    const hero = document.getElementById('hero');
    container.innerHTML = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (id === 'nav-home') {
        hero.style.display = 'flex';
        await renderHero();
        await renderRow("STREAMFLIX ORIGINALS", requests.fetchNetflixOriginals, true);

        await renderTop10Row("Top 10 Movies Today", requests.fetchTrendingMoviesDay);
        await renderRow("Trending Now", requests.fetchTrending, true);
        await renderRow("New Hindi Movies", requests.fetchIndianMovies, true);
        await renderRow("New Comedy Movies", requests.fetchNewComedy, true);
        await renderRow("New Kannada Movies", requests.fetchKannadaMovies, true);
        await renderRow("New Telugu Movies", requests.fetchTeluguMovies, true);
        await renderRow("New Tamil Movies", requests.fetchTamilMovies, true);
        await renderRow("Top Rated", requests.fetchTopRated, true);
    } else {
        hero.style.display = 'none';
        appHeader?.classList.add('scrolled');
        if (id === 'nav-tvshows') await renderGrid("TV Shows", requests.fetchTVShows);
        else if (id === 'nav-movies') await renderGrid("Movies", requests.fetchMovies);
        else if (id === 'nav-latest') await renderGrid("New & Popular", requests.fetchTrending);
        else if (id === 'nav-mylist') {
            const list = getMyList();
            container.innerHTML = `<h1 class="page-title">My List</h1>`;
            if (list.length === 0) {
                container.innerHTML += '<p style="margin: 20px 4%; color: #808080;">Your list is empty.</p>';
            } else {
                const grid = document.createElement('div');
                grid.className = 'movie-grid';
                list.forEach(movie => {
                    // Handle both custom backdrop/poster or tmdb ones
                    const imgUrl = movie.custom ? movie.backdrop_path : `${POSTER_BASE_URL}${movie.poster_path || movie.backdrop_path}`;

                    const item = document.createElement('div');
                    item.className = 'grid-item';
                    item.innerHTML = `<img src="${imgUrl}" alt="${movie.title || movie.name}">`;
                    item.onclick = () => showMovieDetails(movie, false);
                    grid.appendChild(item);
                });
                container.appendChild(grid);
            }
        }
    }
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.onclick = (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        loadPage(link.id);
    };

});

function updateProfileDropdown() {
    const currentProfile = localStorage.getItem('netflix_clone_profile');
    const container = document.getElementById('other-profiles');
    if (!container) return;

    container.innerHTML = ''; // Clear existing lists

    // Find all profiles from the main selection screen
    const allProfileCards = document.querySelectorAll('.profile-list .profile-card');

    allProfileCards.forEach(card => {
        const name = card.getAttribute('data-profile');
        const img = card.querySelector('img').src;

        // Skip the currently active profile
        if (name === currentProfile) return;

        const row = document.createElement('div');
        row.className = 'dropdown-profile-row';
        row.innerHTML = `<img src="${img}" alt="${name}"><span>${name}</span>`;

        // Allow switching to this profile
        row.onclick = () => {
            localStorage.setItem('netflix_clone_profile', name);
            localStorage.setItem('netflix_clone_profile_img', img);

            // Update the main icon immediately
            const profileIconImg = document.querySelector('#icon-profile img');
            if (profileIconImg) profileIconImg.src = img;

            // Refresh to effectively "switch" profile content (re-run init/showHomePage)
            location.reload();
        };

        container.appendChild(row);
    });
}


const manageProfilesLink = document.getElementById('manage-profiles-link');
if (manageProfilesLink) {
    manageProfilesLink.onclick = () => {
        showProfileSelection();
    };
}

// Movie Details Modal with Embedded Trailer
async function showMovieDetails(movie, autoPlay = false) {
    // Check if added to list
    const currentList = getMyList();
    const isAdded = currentList.some(m => m.id === movie.id || m.title === movie.title);
    const btnIcon = isAdded ? '<i class="fas fa-check"></i>' : '<i class="fas fa-star"></i>';
    const btnText = isAdded ? 'Added' : 'Favorites';

    // Clear previous content
    modalBody.innerHTML = '';

    // Create Close Button
    const closeSpan = document.createElement('span');
    closeSpan.className = 'close-button';
    closeSpan.innerHTML = '&times;';
    closeSpan.onclick = () => {
        modal.style.display = 'none';
        modalBody.innerHTML = ''; // Stop video
    };
    modalBody.appendChild(closeSpan);

    const backdropUrl = movie.custom ? movie.backdrop_path : IMAGE_BASE_URL + movie.backdrop_path;

    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = `
        <h2 style="margin-top: 0; padding-right: 30px; margin-bottom: 10px;">${movie.name || movie.title}</h2>
        <div id="modal-media-container" style="position: relative; width: 100%; aspect-ratio: 16/9; background: #000; border-radius: 8px; overflow: hidden; margin-bottom: 15px;">
            <img src="${backdropUrl}" style="width:100%; height: 100%; object-fit: cover;">
        </div>
        
        <div id="modal-controls" style="display: flex; gap: 10px; margin-bottom: 20px;">
            <button id="modal-mylist-btn" class="btn btn-add" style="padding: 8px 20px; font-size: 1rem;">${btnIcon} ${btnText}</button>
        </div>

        <p><strong>Rating:</strong> ${movie.vote_average} / 10</p>
        <p style="margin-top:10px;">${movie.overview}</p>
    `;
    modalBody.appendChild(contentDiv);
    modal.style.display = "block";

    const listBtn = document.getElementById('modal-mylist-btn');
    if (listBtn) listBtn.onclick = (e) => toggleMyList(movie, e.target.closest('button'));
}





function updateHeaderUI() {
    const profile = localStorage.getItem('netflix_clone_profile');
    const profileImg = localStorage.getItem('netflix_clone_profile_img');

    // Update main header profile icon
    const profileIconImg = document.querySelector('#icon-profile img');
    if (profileIconImg && profileImg) {
        profileIconImg.src = profileImg;
    }

    // Update dropdown main profile
    const dropdownProfileName = document.querySelector('.dropdown-profile-row strong');
    if (dropdownProfileName && profile) {
        dropdownProfileName.textContent = profile;
    }
}

function showLandingPage() {
    document.getElementById('landing-page').style.display = 'block';
    document.getElementById('profile-selection').style.display = 'none';
    document.getElementById('home-page').style.display = 'none';
    authOverlay.style.display = 'none';

    if (landingHeader) {
        landingHeader.style.display = 'flex';
        landingHeader.classList.add('landing-header');
        landingHeader.style.backgroundColor = 'transparent';
    }
}

async function init() {
    // Determine where to go immediately
    const auth = localStorage.getItem('netflix_clone_auth');
    const profile = localStorage.getItem('netflix_clone_profile');

    if (auth && profile) {
        updateHeaderUI();
        showHomePage();
    } else if (auth) {
        showProfileSelection();
    } else {
        showLandingPage();
        renderLandingTrending();
    }

    // Logo Click Handlers
    const logoApp = document.getElementById('logo-app');
    if (logoApp) {
        logoApp.onclick = () => {
            const activeNav = document.querySelector('.nav-links a.active') || { id: 'nav-home' };
            if (activeNav.id !== 'nav-home') {
                document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
                document.getElementById('nav-home').classList.add('active');
            }
            loadPage('nav-home');
        };
    }

    const logoLanding = document.getElementById('logo-landing');
    if (logoLanding) {
        logoLanding.onclick = () => showLandingPage();
    }
}

init();
