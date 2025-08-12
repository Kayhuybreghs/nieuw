import './style.css'
import { setupCounter } from './counter.js' // als je deze nodig hebt

// Helpers
const isMobile = matchMedia('(max-width: 767px)').matches
const hasHover = matchMedia('(hover: hover)').matches

// 1) FAQ: lazy op zicht
const faqEl = document.querySelector('[data-faq]')
if (faqEl) {
  const ioFaq = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      import('./faq.js').then(m => m.initFaq?.())
      ioFaq.disconnect()
    }
  }, { rootMargin: '400px' })
  ioFaq.observe(faqEl)
}

// 2) Charts: direct op desktop, lazy-op-zicht op mobiel
const chartSection = document.querySelector('[data-chart]')
if (chartSection) {
  if (!isMobile) {
    // Desktop: direct laden (bovenaan)
    import('./chart-interactions.js').then(m => m.initCharts?.())
  } else {
    // Mobiel: pas laden als (bijna) zichtbaar
    const ioChart = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        import('./chart-interactions.js').then(m => m.initCharts?.())
        ioChart.disconnect()
      }
    }, { rootMargin: '300px' })
    ioChart.observe(chartSection)
  }
}

// 3) Bubbles: alleen op desktop met hover, en alleen als element bestaat
const bubblesContainer = document.querySelector('[data-bubbles]')
if (bubblesContainer && hasHover && !isMobile) {
  const loadBubbles = () => import('./floating-bubbles.js').then(m => m.initBubbles?.())
  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadBubbles, { timeout: 2000 }) // uitgesteld om TBT te sparen
  } else {
    setTimeout(loadBubbles, 0)
  }
}
