/**
 * FAQ Functionality Module
 * Handles FAQ category switching, search, and item toggling
 */

(function() {
    'use strict';
    
    // Cache DOM elements for performance
    let domCache = {};
    
    // Initialize DOM cache
    function initDOMCache() {
        domCache = {
            searchInput: document.getElementById('sFaqSearchInput'),
            searchBtn: document.getElementById('sFaqSearchBtn'),
            categoryTabs: document.querySelectorAll('.s-category-tab'),
            faqItems: document.querySelectorAll('.s-faq-item'),
            categoryContents: document.querySelectorAll('.s-faq-category-content'),
            blogCta: document.querySelector('.s-blog-cta')
        };
    }
    
    // Show FAQ category
    function showFaqCategory(category) {
        // Reset search input
        if (domCache.searchInput) {
            domCache.searchInput.value = '';
            // Remove hidden-search class from all items
            domCache.faqItems.forEach(item => {
                item.classList.remove('hidden-search');
            });
        }
        
        // Hide all categories
        domCache.categoryContents.forEach(cat => {
            cat.classList.add('s-hidden');
        });
        
        // Show selected category
        const selectedCategory = document.getElementById(`s-faq-${category}`);
        if (selectedCategory) {
            selectedCategory.classList.remove('s-hidden');
            // Ensure all items in selected category are visible
            selectedCategory.querySelectorAll('.s-faq-item').forEach(item => {
                item.classList.remove('hidden-search');
            });
        }
    }
    
    // Update tab counts
    function updateTabCounts() {
        const categories = ['algemeen', 'prijzen', 'technisch'];
        categories.forEach(category => {
            const categoryElement = document.getElementById(`s-faq-${category}`);
            const count = categoryElement ? categoryElement.querySelectorAll('.s-faq-item').length : 0;
            const tab = document.querySelector(`[data-category="${category}"] .s-tab-count`);
            if (tab) {
                tab.textContent = count;
            }
        });
    }
    
    // Initialize FAQ item click handlers
    function initializeFaqItems() {
        domCache.faqItems.forEach(faqItem => {
            const questionWrapper = faqItem.querySelector('.s-faq-question-wrapper');
            const expandBtn = faqItem.querySelector('.s-expand-btn');
            
            if (questionWrapper && expandBtn) {
                questionWrapper.addEventListener('click', () => {
                    faqItem.classList.toggle('expanded');
                    expandBtn.textContent = faqItem.classList.contains('expanded') ? '−' : '+';
                });
            }
        });
    }
    
    // Initialize category tab handlers
    function initializeCategoryTabs() {
        domCache.categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active tab
                domCache.categoryTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Get category and show FAQs
                const category = tab.getAttribute('data-category');
                showFaqCategory(category);
                
                // Conditional scroll for desktop only
                setTimeout(() => {
                    if (window.innerWidth > 900 && domCache.blogCta) {
                        const blogCtaPosition = domCache.blogCta.offsetTop;
                        window.scrollTo({
                            top: blogCtaPosition - 700,
                            behavior: 'smooth'
                        });
                    }
                }, 100);
            });
        });
    }
    
    // FAQ search functionality
    function filterFAQ() {
        const query = domCache.searchInput.value.toLowerCase().trim();
        const words = query.split(' ').filter(w => w.length > 0);
        
        if (words.length > 0) {
            // Show all categories during search
            domCache.categoryContents.forEach(cat => {
                cat.classList.remove('s-hidden');
            });
            
            // Filter items based on search query
            domCache.faqItems.forEach(item => {
                const questionElement = item.querySelector('.s-question-content h4');
                const answerElement = item.querySelector('.s-faq-answer p');
                
                if (questionElement && answerElement) {
                    const question = questionElement.textContent.toLowerCase();
                    const answer = answerElement.textContent.toLowerCase();
                    const text = question + ' ' + answer;
                    
                    const matches = words.every(word => text.includes(word));
                    item.classList.toggle('hidden-search', !matches);
                }
            });
        } else {
            // No search term: return to normal category view
            const activeTab = document.querySelector('.s-category-tab.active');
            if (activeTab) {
                const activeCategory = activeTab.getAttribute('data-category');
                showFaqCategory(activeCategory);
            }
            // Remove hidden-search class from all items
            domCache.faqItems.forEach(item => {
                item.classList.remove('hidden-search');
            });
        }
    }
    
    // Initialize search functionality
    function initializeSearch() {
        if (domCache.searchInput && domCache.searchBtn) {
            domCache.searchInput.addEventListener('keyup', filterFAQ);
            domCache.searchBtn.addEventListener('click', filterFAQ);
        }
    }
    
    // Main initialization function for FAQ
    function initFaq() {
        // Initialize DOM cache
        initDOMCache();
        
        // Initialize all FAQ functionality
        updateTabCounts();
        showFaqCategory('algemeen');
        initializeFaqItems();
        initializeCategoryTabs();
        initializeSearch();
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFaq);
    } else {
        initFaq();
    }
    
})();

/**
 * Newsletter Popup Functionality
 * Handles newsletter form submission and popup display
 */
(function () {
    'use strict';
    
    // Initialize newsletter functionality when DOM is ready
    function initNewsletter() {
        const form = document.getElementById('sNewsletter');
        const modal = document.getElementById('sNlModal');
        const closeBtn = document.getElementById('sNlClose');

        // Early return if elements don't exist
        if (!form || !modal || !closeBtn) {
            return;
        }

        // Modal helper functions
        function openModal() { 
            modal.style.display = 'flex'; 
            modal.setAttribute('aria-hidden','false'); 
        }
        
        function closeModal() { 
            modal.style.display = 'none'; 
            modal.setAttribute('aria-hidden','true'); 
        }

        // Event listeners
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { 
            if (e.target === modal) closeModal(); 
        });

        // Form submission handler
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent navigation
            const formData = new FormData(form);

            try {
                // Use no-cors mode for cross-origin requests
                await fetch(form.action, { 
                    method: 'POST', 
                    body: formData, 
                    mode: 'no-cors' 
                });
                form.reset();
                openModal();
            } catch (err) {
                // Fallback: allow normal form submission if fetch fails
                form.submit();
            }
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNewsletter);
    } else {
        initNewsletter();
    }
    
})();