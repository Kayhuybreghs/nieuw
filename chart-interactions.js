class ChartInteractions {
    constructor() {
        this.tooltip = this.createTooltip();
        this.dataPoints = document.querySelectorAll('.data-point');
        this.chartContainer = document.querySelector('.chart-container');
        
        this.init();
    }
    
    createTooltip() {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        document.body.appendChild(tooltip);
        return tooltip;
    }
    
    init() {
        this.addEventListeners();
        this.startAnimation();
    }
    
    addEventListeners() {
        this.dataPoints.forEach(point => {
            point.addEventListener('mouseenter', this.showTooltip.bind(this));
            point.addEventListener('mouseleave', this.hideTooltip.bind(this));
            point.addEventListener('mousemove', this.updateTooltipPosition.bind(this));
        });
        
        // Chart hover effects
        this.chartContainer.addEventListener('mouseenter', this.activateChart.bind(this));
        this.chartContainer.addEventListener('mouseleave', this.deactivateChart.bind(this));
    }
    
    showTooltip(event) {
        const point = event.target;
        const value = point.getAttribute('data-value');
        const date = point.getAttribute('data-date');
        
        this.tooltip.innerHTML = `
            <div style="font-weight: 700; margin-bottom: 2px;">${value} bezoekers</div>
            <div style="font-size: 9px; opacity: 0.9;">${date} 2025</div>
        `;
        
        this.tooltip.classList.add('show');
        this.updateTooltipPosition(event);
    }
    
    hideTooltip() {
        this.tooltip.classList.remove('show');
    }
    
    updateTooltipPosition(event) {
        const x = event.clientX;
        const y = event.clientY;
        
        // Zorg dat tooltip niet buiten scherm valt
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let finalX = x - tooltipRect.width / 2;
        let finalY = y - 50;
        
        // Check rechter rand
        if (finalX + tooltipRect.width > viewportWidth - 10) {
            finalX = viewportWidth - tooltipRect.width - 10;
        }
        
        // Check linker rand
        if (finalX < 10) {
            finalX = 10;
        }
        
        // Check bovenkant
        if (finalY < 10) {
            finalY = y + 20; // Plaats onder cursor
        }
        
        this.tooltip.style.left = `${finalX}px`;
        this.tooltip.style.top = `${finalY}px`;
    }
    
    activateChart() {
        this.dataPoints.forEach(point => {
            point.style.opacity = '1';
        });
    }
    
    deactivateChart() {
        this.dataPoints.forEach(point => {
            point.style.opacity = '0.7';
        });
    }
    
    startAnimation() {
        // Trigger entrance animations
        setTimeout(() => {
            this.chartContainer.classList.add('animated');
        }, 100);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChartInteractions();
});

// Intersection Observer for scroll-triggered animations
const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const chart = entry.target;
            chart.classList.add('in-view');
            
            // Restart animations when scrolled into view
            const line = chart.querySelector('.chart-line');
            const area = chart.querySelector('.chart-area');
            const points = chart.querySelectorAll('.data-point');
            
            if (line) {
                line.style.animation = 'none';
                setTimeout(() => {
                    line.style.animation = 'drawLine 2s ease-out forwards';
                }, 10);
            }
            
            if (area) {
                area.style.animation = 'none';
                setTimeout(() => {
                    area.style.animation = 'fadeInArea 1.5s ease-out 0.5s forwards';
                }, 10);
            }
            
            points.forEach((point, index) => {
                point.style.animation = 'none';
                setTimeout(() => {
                    point.style.animation = `growPoint 0.5s ease-out forwards`;
                    point.style.animationDelay = `${1.8 + index * 0.2}s`;
                }, 10);
            });
        }
    });
}, { 
    threshold: 0.5
});

document.addEventListener('DOMContentLoaded', () => {
    const chartContainer = document.querySelector('.chart-container');
    if (chartContainer) {
        chartObserver.observe(chartContainer);
    }
});