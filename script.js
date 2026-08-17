let currentSlide = 0;
let currentDeckName = 'maria';

if (document.body.classList.contains('theme-bella')) {
    currentDeckName = 'bella';
} else if (document.body.classList.contains('theme-nature') || document.body.classList.contains('theme-verde')) {
    currentDeckName = 'nature';
}

let transitionOverlay = null;

function getSlides() {
    const deck = document.querySelector('.deck');
    if (!deck) return [];
    return Array.from(deck.querySelectorAll('.slide'));
}

function ensureTransitionOverlay() {
    if (transitionOverlay) return transitionOverlay;

    transitionOverlay = document.createElement('div');
    transitionOverlay.className = 'deck-transition';
    document.body.appendChild(transitionOverlay);
    return transitionOverlay;
}

function setTheme(theme) {
    document.body.classList.remove('theme-maria', 'theme-bella', 'theme-nature', 'theme-verde');
    
    if (theme === 'bella') {
        document.body.classList.add('theme-bella');
    } else if (theme === 'nature') {
        document.body.classList.add('theme-nature');
    } else {
        document.body.classList.add('theme-maria');
    }
    
    currentDeckName = theme;
}

function updateShaderButton() {
    const button = document.querySelector('[data-action="light-mode"]');
    if (!button) return;

    const isLite = document.body.classList.contains('shader-lite');
    button.classList.toggle('is-active', isLite);
    button.setAttribute('aria-pressed', String(isLite));

    const icon = button.querySelector('.material-symbols-rounded');
    if (icon) {
        icon.textContent = isLite ? 'visibility_off' : 'park';
    }

    const label = button.querySelector('.btn-label');
    if (label) {
        label.textContent = isLite ? 'Efeitos Ocultos' : 'Efeitos Ativos';
    }
}

function renderSlides() {
    const deck = document.querySelector('.deck');
    if (!deck) return;

    const slides = getSlides();
    const dotsContainer = deck.querySelector('.dots');

    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });

    if (dotsContainer) {
        dotsContainer.innerHTML = slides.map((_, index) => `<span class="dot ${index === 0 ? 'active' : ''}"></span>`).join('');

        const dots = Array.from(dotsContainer.children);
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
}

function goToSlide(index) {
    const slides = getSlides();
    if (!slides.length) return;

    currentSlide = (index + slides.length) % slides.length;
    renderSlides();
}

/* Lógica rotativa entre os 3 slides */
function updateToggleButtonLabel() {
    document.querySelectorAll('[data-action="toggle"]').forEach((button) => {
        if (currentDeckName === 'maria') {
            button.textContent = 'School of Darkness • 1954';
            button.dataset.target = 'bella';
        } else if (currentDeckName === 'bella') {
            button.textContent = 'Ciência & Natureza';
            button.dataset.target = 'nature';
        } else {
            button.textContent = 'Lei Maria da Penha • Lei nº 11.340';
            button.dataset.target = 'maria';
        }
    });
}

async function switchDeck(target) {
    const deck = document.querySelector('.deck');
    if (!deck) return;

    const overlay = ensureTransitionOverlay();
    overlay.classList.add('active');

    let source = 'index.html';
    if (target === 'bella') source = 'bella-dodd.html';
    if (target === 'nature') source = 'Feijão-Fradinho.html';

    try {
        const response = await fetch(source);
        if (!response.ok) throw new Error('Falha ao carregar a apresentação');

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const incomingDeck = doc.querySelector('main.deck');

        if (!incomingDeck) throw new Error('Estrutura da apresentação não encontrada');

        setTheme(target);
        await new Promise((resolve) => window.setTimeout(resolve, 220));
        deck.innerHTML = incomingDeck.innerHTML;
        currentSlide = 0;
        renderSlides();
        updateToggleButtonLabel();
        window.requestAnimationFrame(() => overlay.classList.remove('active'));
    } catch (error) {
        overlay.classList.remove('active');
    }
}

let controlsVisible = false;

function setControlsVisible(visible) {
    controlsVisible = visible;

    document.querySelectorAll('.controls-wrapper').forEach((wrapper) => {
        wrapper.classList.toggle('is-hidden', !visible);
    });

    document.querySelectorAll('.toggle-btn').forEach((button) => {
        button.classList.toggle('is-hidden', !visible);
    });

    document.querySelectorAll('.controls-toggle-wrapper').forEach((wrapper) => {
        wrapper.classList.remove('is-hidden');
    });
}

function handleControlClick(event) {
    const button = event.target.closest('[data-action]');
    if (!button) return;

    if (button.dataset.action === 'next') {
        goToSlide(currentSlide + 1);
    }

    if (button.dataset.action === 'prev') {
        goToSlide(currentSlide - 1);
    }

    if (button.dataset.action === 'toggle') {
        switchDeck(button.dataset.target);
    }

    if (button.dataset.action === 'hide-controls') {
        setControlsVisible(!controlsVisible);
    }

    if (button.dataset.action === 'light-mode') {
        document.body.classList.toggle('shader-lite');
        updateShaderButton();
    }
}

function handleKeydown(event) {
    if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        goToSlide(currentSlide + 1);
    }

    if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToSlide(currentSlide - 1);
    }
}

document.addEventListener('click', handleControlClick);
document.addEventListener('keydown', handleKeydown);

setTheme(currentDeckName);
renderSlides();
updateToggleButtonLabel();
updateShaderButton();
setControlsVisible(false);