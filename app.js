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
// 4. STORY TOGGLE BUTTON
// ==========================================================================

const storyToggleBtn = document.getElementById('story-toggle-btn');
const storyDesc = document.getElementById('story-desc');

if (storyToggleBtn && storyDesc) {
    storyToggleBtn.addEventListener('click', () => {
        const isCollapsed = storyDesc.classList.contains('collapsed');
        if (isCollapsed) {
            storyDesc.classList.remove('collapsed');
            storyToggleBtn.classList.add('active');
            storyToggleBtn.querySelector('span').textContent = 'View less';
        } else {
            storyDesc.classList.add('collapsed');
            storyToggleBtn.classList.remove('active');
            storyToggleBtn.querySelector('span').textContent = 'View more';
            
            // Smoothly scroll back to card top if needed
            document.getElementById('story').scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// ==========================================================================
// 5. DRAGGABLE POLAROID STACK
// ==========================================================================

const photoStack = document.getElementById('photo-stack');
const cards = document.querySelectorAll('.draggable-card');

if (photoStack && cards.length > 0) {
    let activeCard = null;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let initialRotation = 0;
    
    // Store original position styles for cycling
    const initialStyles = Array.from(cards).map(card => {
        return {
            rotation: card.style.getPropertyValue('--rotation') || '0deg',
            x: card.style.getPropertyValue('--x') || '0px',
            y: card.style.getPropertyValue('--y') || '0px',
            zIndex: parseInt(card.style.zIndex) || 1
        };
    });

    cards.forEach((card, index) => {
        card.addEventListener('mousedown', (e) => startDrag(e, card, index));
        card.addEventListener('touchstart', (e) => startDrag(e, card, index), { passive: true });
    });

    function startDrag(e, card, index) {
        // Only trigger drag if it's the topmost card currently
        const currentZIndices = Array.from(cards).map(c => parseInt(c.style.zIndex) || 1);
        const maxZIndex = Math.max(...currentZIndices);
        const cardZIndex = parseInt(card.style.zIndex) || 1;
        
        if (cardZIndex < maxZIndex) return; // Disallow dragging back cards directly

        activeCard = card;
        activeCard.style.transition = 'none';

        const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;

        // Parse current card inline offset variables
        const currentOffsetX = parseFloat(activeCard.style.getPropertyValue('--x')) || 0;
        const currentOffsetY = parseFloat(activeCard.style.getPropertyValue('--y')) || 0;

        startX = clientX - currentOffsetX;
        startY = clientY - currentOffsetY;
        
        const rotationVal = activeCard.style.getPropertyValue('--rotation');
        initialRotation = parseFloat(rotationVal) || 0;

        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);
    }

    function drag(e) {
        if (!activeCard) return;

        // Prevent body scrolling while sliding cards on touch screens
        if (e.cancelable) e.preventDefault();

        const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;

        currentX = clientX - startX;
        currentY = clientY - startY;

        // Dynamically rotate card slightly based on drag direction for realism
        const dynamicRotation = initialRotation + (currentX * 0.08);

        activeCard.style.setProperty('--x', `${currentX}px`);
        activeCard.style.setProperty('--y', `${currentY}px`);
        activeCard.style.setProperty('--rotation', `${dynamicRotation}deg`);
        activeCard.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${dynamicRotation}deg) scale(1.05)`;
    }

    function endDrag() {
        if (!activeCard) return;

        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchend', endDrag);

        const dragDistance = Math.sqrt(currentX * currentX + currentY * currentY);
        
        // Fling thresholds
        if (dragDistance > 110) {
            flingCard(activeCard);
        } else {
            resetCard(activeCard);
        }

        activeCard = null;
    }

    function flingCard(card) {
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        
        // Fling direction calculation
        const angle = Math.atan2(currentY, currentX);
        const flingX = Math.cos(angle) * 350;
        const flingY = Math.sin(angle) * 350;
        const targetRotation = initialRotation + (flingX * 0.1);

        card.style.setProperty('--x', `${flingX}px`);
        card.style.setProperty('--y', `${flingY}px`);
        card.style.setProperty('--rotation', `${targetRotation}deg`);
        card.style.transform = `translate(${flingX}px, ${flingY}px) rotate(${targetRotation}deg) scale(0.95)`;
        card.style.opacity = '0';

        setTimeout(() => {
            cycleZIndices(card);
            
            // Bring card back into pile smoothly at the bottom
            card.style.transition = 'none';
            
            const origStyle = getOriginalStyle(card);
            card.style.setProperty('--x', origStyle.x);
            card.style.setProperty('--y', origStyle.y);
            card.style.setProperty('--rotation', origStyle.rotation);
            card.style.transform = `translate(${origStyle.x}, ${origStyle.y}) rotate(${origStyle.rotation})`;
            
            // Trigger browser reflow before fading in
            void card.offsetWidth;
            
            card.style.transition = 'transform 0.5s var(--transition-curve), opacity 0.5s ease';
            card.style.opacity = '1';
        }, 300);
    }

    function resetCard(card) {
        card.style.transition = 'transform 0.4s var(--transition-curve)';
        const origStyle = getOriginalStyle(card);
        
        card.style.setProperty('--x', origStyle.x);
        card.style.setProperty('--y', origStyle.y);
        card.style.setProperty('--rotation', origStyle.rotation);
        card.style.transform = `translate(${origStyle.x}, ${origStyle.y}) rotate(${origStyle.rotation})`;
    }

    function cycleZIndices(draggedCard) {
        const currentZIndices = Array.from(cards).map(c => parseInt(c.style.zIndex) || 1);
        const minZIndex = Math.min(...currentZIndices);

        cards.forEach(card => {
            const currentZ = parseInt(card.style.zIndex) || 1;
            if (card === draggedCard) {
                card.style.zIndex = minZIndex; // Sent to bottom
            } else {
                card.style.zIndex = currentZ + 1; // Slide forward
            }
        });
    }

    function getOriginalStyle(card) {
        const cardIndex = Array.from(cards).indexOf(card);
        return initialStyles[cardIndex];
    }
}

// ==========================================================================
// INITIALIZATION ON LOAD
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
});
