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
    // Default to dark theme if no preference is saved
    const initialTheme = savedTheme || 'dark';
    
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
// 2. STORY EXPANDER (VIEW MORE)
// ==========================================================================

const storyDesc = document.getElementById('story-desc');
const storyToggleBtn = document.getElementById('story-toggle-btn');
const storyToggleText = storyToggleBtn.querySelector('span');

storyToggleBtn.addEventListener('click', () => {
    const isCollapsed = storyDesc.classList.contains('collapsed');
    
    if (isCollapsed) {
        storyDesc.classList.remove('collapsed');
        storyToggleText.textContent = 'View less';
        storyToggleBtn.classList.add('active');
    } else {
        storyDesc.classList.add('collapsed');
        storyToggleText.textContent = 'View more';
        storyToggleBtn.classList.remove('active');
        // Smooth scroll back to top of story if they collapse it
        document.getElementById('story').scrollIntoView({ behavior: 'smooth' });
    }
});

// ==========================================================================
// 3. COPY TO CLIPBOARD BUTTONS
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
// 4. INTERACTIVE TIMELINE (EXPERIENCE WORKFLOW)
// ==========================================================================

const timelineTabs = document.querySelectorAll('.timeline-tab');
const timelinePanels = document.querySelectorAll('.timeline-panel');

timelineTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active state from all tabs and hide panels
        timelineTabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
        });
        
        timelinePanels.forEach(p => {
            p.classList.remove('active');
        });
        
        // Activate clicked tab
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        
        // Show corresponding panel
        const targetPanelId = tab.getAttribute('aria-controls');
        const targetPanel = document.getElementById(targetPanelId);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
    });
});

// ==========================================================================
// 5. BENTO CARD MOUSE TRACKING GLOW
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
// 6. RECOMMENDATIONS (TESTIMONIALS MANAGER)
// ==========================================================================

const recommendationsContainer = document.getElementById('recommendations-container');
const recommendationsEmpty = document.getElementById('recommendations-empty');
const openModalBtn = document.getElementById('open-testimonial-modal');
const emptyAddBtn = document.getElementById('empty-state-add-btn');
const closeModalBtn = document.getElementById('close-testimonial-modal');
const testimonialModal = document.getElementById('testimonial-modal');
const testimonialForm = document.getElementById('testimonial-form');

// Local testimonials registry
let testimonials = [];

// Load from LocalStorage
function loadTestimonials() {
    const stored = localStorage.getItem('portfolio-testimonials');
    if (stored) {
        testimonials = JSON.parse(stored);
    }
    renderTestimonials();
}

// Save to LocalStorage
function saveTestimonials() {
    localStorage.setItem('portfolio-testimonials', JSON.stringify(testimonials));
}

// Render recommendations
function renderTestimonials() {
    // We already have preloaded items in index.html.
    // User-submitted items will be added inside an active list at the end.
    let list = recommendationsContainer.querySelector('.testimonial-list');
    
    if (testimonials.length === 0) {
        if (list) list.remove();
        // Check if preloaded list also doesn't exist (e.g. if we chose to hide it)
        const preloaded = recommendationsContainer.querySelector('.preloaded-recommendations-list');
        if (!preloaded) {
            recommendationsEmpty.style.display = 'flex';
        } else {
            recommendationsEmpty.style.display = 'none';
        }
    } else {
        recommendationsEmpty.style.display = 'none';
        
        // Create or clear list
        if (!list) {
            list = document.createElement('div');
            list.className = 'testimonial-list';
            recommendationsContainer.appendChild(list);
        } else {
            list.innerHTML = '';
        }
        
        testimonials.forEach(t => {
            const item = document.createElement('div');
            item.className = 'testimonial-item';
            
            // Get initial/first letter for user avatar
            const firstLetter = t.name ? t.name.charAt(0).toUpperCase() : 'U';
            
            item.innerHTML = `
                <p class="testimonial-text">"${escapeHTML(t.text)}"</p>
                <div class="testimonial-author">
                    <div class="testimonial-author-avatar">${escapeHTML(firstLetter)}</div>
                    <div class="testimonial-meta">
                        <span class="testimonial-name">${escapeHTML(t.name)}</span>
                        <span class="testimonial-role">${escapeHTML(t.role)}</span>
                    </div>
                </div>
            `;
            list.appendChild(item);
        });
    }
}

// Escape input HTML to prevent XSS
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// Modal open/close actions
function toggleModal(show) {
    if (show) {
        testimonialModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent main body scrolling
    } else {
        testimonialModal.classList.remove('active');
        document.body.style.overflow = '';
        testimonialForm.reset();
    }
}

if (openModalBtn) openModalBtn.addEventListener('click', () => toggleModal(true));
if (emptyAddBtn) emptyAddBtn.addEventListener('click', () => toggleModal(true));
if (closeModalBtn) closeModalBtn.addEventListener('click', () => toggleModal(false));

// Close modal when clicking background overlay
testimonialModal.addEventListener('click', (e) => {
    if (e.target === testimonialModal) {
        toggleModal(false);
    }
});

// Form submit action
testimonialForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('testimonial-name').value.trim();
    const role = document.getElementById('testimonial-role').value.trim();
    const text = document.getElementById('testimonial-text').value.trim();
    
    if (name && role && text) {
        testimonials.push({ name, role, text });
        saveTestimonials();
        renderTestimonials();
        toggleModal(false);
    }
});

// ==========================================================================
// 7. DRAGGABLE & INFINITE-CYCLING PHOTO STACK
// ==========================================================================

const photoStack = document.getElementById('photo-stack');
const cards = Array.from(photoStack.querySelectorAll('.draggable-card'));

let activeCard = null;
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;
let rotateVal = 0;

// Track positions and rotations of each card
const cardStates = cards.map((card, index) => {
    // Get initial styles from HTML inline custom properties
    const rotationStr = card.style.getPropertyValue('--rotation') || '0deg';
    const xStr = card.style.getPropertyValue('--x') || '0px';
    const yStr = card.style.getPropertyValue('--y') || '0px';
    
    return {
        element: card,
        rotation: parseFloat(rotationStr),
        x: parseFloat(xStr),
        y: parseFloat(yStr),
        zIndex: parseInt(card.style.zIndex) || (cards.length - index)
    };
});

function initDraggableCards() {
    cardStates.forEach(state => {
        const el = state.element;
        
        // Mouse Down
        el.addEventListener('mousedown', (e) => startDrag(e, state));
        // Touch Start
        el.addEventListener('touchstart', (e) => startDrag(e, state), { passive: true });
    });
}

function startDrag(e, state) {
    activeCard = state;
    
    // Disable CSS transition during drag for real-time tracking
    activeCard.element.style.transition = 'none';
    
    // Get input origin
    const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
    
    startX = clientX - activeCard.x;
    startY = clientY - activeCard.y;
    
    // Add global mousemove/mouseup listeners
    if (e.type.startsWith('touch')) {
        document.addEventListener('touchmove', onDrag, { passive: false });
        document.addEventListener('touchend', endDrag);
    } else {
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', endDrag);
    }
    
    // Push active card slightly forward visually
    activeCard.element.style.zIndex = 100;
}

function onDrag(e) {
    if (!activeCard) return;
    
    // Prevent touch scrolling when dragging cards
    if (e.cancelable) e.preventDefault();
    
    const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
    
    currentX = clientX - startX;
    currentY = clientY - startY;
    
    activeCard.x = currentX;
    activeCard.y = currentY;
    
    // Add dynamic rotation based on drag offset
    rotateVal = activeCard.rotation + (currentX * 0.08);
    
    activeCard.element.style.setProperty('--x', `${currentX}px`);
    activeCard.element.style.setProperty('--y', `${currentY}px`);
    activeCard.element.style.setProperty('--rotation', `${rotateVal}deg`);
}

function endDrag() {
    if (!activeCard) return;
    
    // Clean up event listeners
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchmove', onDrag);
    document.removeEventListener('touchend', endDrag);
    
    // Re-enable smooth transitions for animations
    activeCard.element.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    const dragDistance = Math.sqrt(activeCard.x * activeCard.x + activeCard.y * activeCard.y);
    
    // Threshold to cycle the card to bottom: 110px
    if (dragDistance > 110) {
        cycleCardToBottom(activeCard);
    } else {
        // Snap back to original position
        snapBack(activeCard);
    }
    
    activeCard = null;
}

function snapBack(state) {
    state.x = 0;
    state.y = 0;
    state.element.style.setProperty('--x', '0px');
    state.element.style.setProperty('--y', '0px');
    state.element.style.setProperty('--rotation', `${state.rotation}deg`);
    state.element.style.zIndex = state.zIndex;
}

function cycleCardToBottom(state) {
    // 1. Move card further out in the direction it was dragged (fling animation)
    const angle = Math.atan2(state.y, state.x);
    const flingDist = 300;
    const targetX = Math.cos(angle) * flingDist;
    const targetY = Math.sin(angle) * flingDist;
    
    state.element.style.setProperty('--x', `${targetX}px`);
    state.element.style.setProperty('--y', `${targetY}px`);
    state.element.style.opacity = '0';
    
    // 2. While card is invisible and far away, adjust z-indices
    setTimeout(() => {
        // Find minimum z-index current in stack
        let minZ = Math.min(...cardStates.map(s => s.zIndex));
        
        // Decrement target card below the minimum
        const targetZ = minZ - 1;
        state.zIndex = targetZ;
        state.element.style.zIndex = targetZ;
        
        // Normalize stack z-indices (prevent numbers growing infinitely negative)
        normalizeZIndices();
        
        // Reset card coordinates to center with small random tilt
        state.x = (Math.random() - 0.5) * 20;
        state.y = (Math.random() - 0.5) * 20;
        state.rotation = (Math.random() - 0.5) * 12;
        
        state.element.style.setProperty('--x', `${state.x}px`);
        state.element.style.setProperty('--y', `${state.y}px`);
        state.element.style.setProperty('--rotation', `${state.rotation}deg`);
        
        // 3. Fade card back in at bottom of stack
        setTimeout(() => {
            state.element.style.opacity = '1';
        }, 50);
        
    }, 300);
}

function normalizeZIndices() {
    // Sort states by current zIndex ascending
    const sorted = [...cardStates].sort((a, b) => a.zIndex - b.zIndex);
    
    // Re-assign sorted values from 1 upwards
    sorted.forEach((state, i) => {
        state.zIndex = i + 1;
        state.element.style.zIndex = state.zIndex;
    });
}

// ==========================================================================
// INITIALIZATION ON LOAD
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadTestimonials();
    initDraggableCards();
});
