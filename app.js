// ==========================================================================
// 1. THEME SWITCHER
// ==========================================================================

const htmlElement = document.documentElement;
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIconDark = themeToggleBtn.querySelector('.theme-icon-dark');
const themeIconLight = themeToggleBtn.querySelector('.theme-icon-light');

// Set theme UI icons based on active theme
function updateThemeIcons(theme) {
    if (theme === 'dark') {
        themeIconDark.style.display = 'none';
        themeIconLight.style.display = 'block';
    } else {
        themeIconDark.style.display = 'block';
        themeIconLight.style.display = 'none';
    }
}

// Initialize Theme from localStorage or system preference
function initTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme');
    const initialTheme = savedTheme || 'dark'; // Default to dark theme
    
    htmlElement.setAttribute('data-theme', initialTheme);
    updateThemeIcons(initialTheme);
}

// Toggle Theme click handler
themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    updateThemeIcons(newTheme);
});

// ==========================================================================
// 2. COPY TO CLIPBOARD BUTTONS
// ==========================================================================

const copyButtons = document.querySelectorAll('.copy-btn');

copyButtons.forEach(button => {
    const textToCopy = button.getAttribute('data-copy');
    const tooltip = button.querySelector('.tooltip-text');
    const originalTooltipText = tooltip ? tooltip.textContent : 'Copy to clipboard';

    button.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            
            // Visual success feedback
            button.classList.add('copied');
            if (tooltip) tooltip.textContent = 'Copied!';
            
            // Reset feedback after delay
            setTimeout(() => {
                button.classList.remove('copied');
                if (tooltip) tooltip.textContent = originalTooltipText;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    });
});

// ==========================================================================
// 3. BENTO CARD MOUSE TRACKING GLOW
// ==========================================================================

const bentoCards = document.querySelectorAll('.portfolio-card');

bentoCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// ==========================================================================
// INITIALIZATION ON LOAD
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
});
