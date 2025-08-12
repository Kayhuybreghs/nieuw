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

const isMobile = matchMedia('(max-width: 767px)').matches
const hasHover = matchMedia('(hover: hover)').matches

const bubblesEl = document.querySelector('[data-bubbles]')

// DESKTOP: meteen laden (zonder window.onload), maar 2× rAF voor stabiele layout
if (bubblesEl && hasHover && !isMobile) {
  const start = () => import('./floating-bubbles.js').then(m => m.initBubbles?.(bubblesEl))
  requestAnimationFrame(() => requestAnimationFrame(start)) // praktisch “direct”
}
  }
}
