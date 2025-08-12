class FloatingBubbles {
    constructor() {
        this.bubbles = document.querySelectorAll('.bubble');
        this.container = document.querySelector('.floating-bubbles');
        this.initialPositions = new Map();
        this.isAnimating = true;
        
        this.init();
    }
    
    init() {
        this.positionBubbles();
        this.storeInitialPositions();
        this.addEventListeners();
        
        // Add click interactions
        this.bubbles.forEach(bubble => {
            bubble.addEventListener('click', this.handleBubbleClick.bind(this));
            bubble.addEventListener('mouseenter', this.handleBubbleHover.bind(this));
        });
    }
    
    positionBubbles() {
        const containerRect = this.container.getBoundingClientRect();
        const containerWidth = containerRect.width || 500;
        const containerHeight = containerRect.height || 400;
        
        this.bubbles.forEach((bubble, index) => {
            let x, y;
            
            // Fixed static positioning
            switch(index) {
                case 0: // Performance bubble - top right
                    x = containerWidth - 100;
                    y = 60;
                    break;
                case 1: // Time bubble - right side middle
                    x = containerWidth + 20;
                    y = containerHeight / 2 + 20;
                    break;
                default:
                    x = containerWidth + 20;
                    y = containerHeight - 100;
            }
            
            bubble.style.left = x + 'px';
            bubble.style.top = y + 'px';
        });
    }
    
    storeInitialPositions() {
        this.bubbles.forEach((bubble, index) => {
            const x = parseFloat(bubble.style.left) || 0;
            const y = parseFloat(bubble.style.top) || 0;
            this.initialPositions.set(index, { x, y });
        });
    }
    
    resetToInitialPositions() {
        this.bubbles.forEach((bubble, index) => {
            const initialPos = this.initialPositions.get(index);
            if (initialPos) {
                bubble.style.left = initialPos.x + 'px';
                bubble.style.top = initialPos.y + 'px';
            }
        });
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => {
            this.positionBubbles();
            this.storeInitialPositions();
        });
    }
    
    handleBubbleClick(event) {
        const bubble = event.currentTarget;
        
        // Subtle click animation
        bubble.style.transform = 'scale(0.98)';
        setTimeout(() => {
            bubble.style.transform = '';
        }, 100);
        
        // Gentle pulse instead of ripple
        this.createPulse(bubble);
    }
    
    handleBubbleHover(event) {
        const bubble = event.currentTarget;
        
        // No animation changes on hover - let it continue naturally
    }
    
    createPulse(bubble) {
        const pulse = document.createElement('div');
        pulse.classList.add('bubble-pulse'); // Voeg de nieuwe CSS-klasse toe
        
        bubble.appendChild(pulse);
        
        setTimeout(() => {
            pulse.remove();
        }, 600);
    }
    
    // Method to pause/resume animations
    toggleAnimation() {
        this.isAnimating = !this.isAnimating;
        this.bubbles.forEach(bubble => {
            bubble.style.animationPlayState = this.isAnimating ? 'running' : 'paused';
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FloatingBubbles();
});

// Performance optimization: Use Intersection Observer for visibility
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const bubble = entry.target;
        if (entry.isIntersecting) {
            bubble.style.animationPlayState = 'running';
        } else {
            bubble.style.animationPlayState = 'paused';
        }
    });
}, observerOptions);

// Observe all bubbles for performance
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.bubble').forEach(bubble => {
        observer.observe(bubble);
    });
});
