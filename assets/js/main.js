// Main site functionality module - organize code in a component-based structure
const MDL = {
    // Initialize all site components
    init: function() {
        this.initMobileMenu();
        
        // Initialize any carousels that exist on the page
        const carousels = document.querySelectorAll('.carousel');
        carousels.forEach(carousel => {
            if (carousel.id) {
                this.initCarousel(carousel.id);
            }
        });
    },
    
    // Mobile menu functionality
    initMobileMenu: function() {
        const navToggle = document.getElementById('navToggle');
        if (!navToggle) return;
        
        navToggle.addEventListener('click', function() {
            const navMenu = document.getElementById('navMenu');
            const isExpanded = navMenu.classList.contains('active');
            
            navMenu.classList.toggle('active');
            this.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle aria-label for improved screen reader feedback
            if (!isExpanded) {
                this.setAttribute('aria-label', 'Close menu');
            } else {
                this.setAttribute('aria-label', 'Open menu');
            }
        });
        
        // Prevent menu closing immediately on touch devices
        if ('ontouchstart' in window) {
            document.querySelectorAll('.nav-menu > li > a').forEach(link => {
                link.addEventListener('click', function(e) {
                    const menu = document.getElementById('navMenu');
                    setTimeout(() => {
                        menu.classList.remove('active');
                    }, 300);
                });
            });
        }
    },

// Form handling component 
handleForms: function() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Form validation (can expand as needed)
        let isValid = true;
        const requiredFields = this.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                
                // Add error message for screen readers
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.setAttribute('aria-live', 'polite');
                errorMsg.textContent = `${field.getAttribute('placeholder')} is required`;
                
                // Only add if not already present
                if (!field.parentNode.querySelector('.error-message')) {
                    field.parentNode.appendChild(errorMsg);
                }
            } else {
                field.classList.remove('error');
                const existingError = field.parentNode.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
            }
        });
        
        if (isValid) {
            // Success feedback
            const successMsg = document.createElement('div');
            successMsg.className = 'success-message';
            successMsg.setAttribute('aria-live', 'assertive');
            successMsg.textContent = 'Thank you for your message. We will contact you shortly.';
            
            // Add success message to the DOM
            const formContainer = document.querySelector('.contact-form');
            formContainer.prepend(successMsg);
            
            // Reset form
            this.reset();
            
            // Remove success message after a delay
            setTimeout(() => {
                successMsg.remove();
            }, 5000);
        }
    });
    
    // Remove error styling once user starts typing
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(field => {
        field.addEventListener('input', function() {
            this.classList.remove('error');
            const errorMsg = this.parentNode.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
        });
    });
},

// Carousel component
initCarousel: function(carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    
    const items = carousel.querySelectorAll('.carousel-inner .item');
    const navContainer = carousel.querySelector('.carousel-nav');
    let currentSlide = 0;
    let slideInterval;
    let isMobile = window.innerWidth < 768;
    
    // Create navigation dots with proper ARIA attributes
    items.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', `Go to slide ${index + 1} of ${items.length}`);
        dot.setAttribute('type', 'button');
        if (index === 0) {
            dot.classList.add('active');
            dot.setAttribute('aria-current', 'true');
        }
        dot.addEventListener('click', () => showSlide(index));
        navContainer.appendChild(dot);
    });

    // Add click handlers for controls
    carousel.querySelector('.prev').addEventListener('click', () => {
        showSlide(currentSlide - 1);
        resetInterval();
    });

    carousel.querySelector('.next').addEventListener('click', () => {
        showSlide(currentSlide + 1);
        resetInterval();
    });

    // Add enhanced touch support for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});
    
    function handleSwipe() {
        const swipeThreshold = 50; // Minimum distance to register as swipe
        if (touchEndX - touchStartX > swipeThreshold) {
            // Swipe right - show previous slide
            showSlide(currentSlide - 1);
            resetInterval();
        } else if (touchStartX - touchEndX > swipeThreshold) {
            // Swipe left - show next slide
            showSlide(currentSlide + 1);
            resetInterval();
        }
    }

    function showSlide(index) {
        // Remove active class from all items and dots
        items.forEach(item => {
            item.classList.remove('active');
            item.setAttribute('aria-hidden', 'true');
        });
        
        const dots = navContainer.querySelectorAll('.carousel-dot');
        dots.forEach(dot => {
            dot.classList.remove('active');
            dot.setAttribute('aria-current', 'false');
        });

        // Handle wrap-around
        currentSlide = index;
        if (currentSlide >= items.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = items.length - 1;

        // Show new active slide and update ARIA attributes
        items[currentSlide].classList.add('active');
        items[currentSlide].setAttribute('aria-hidden', 'false');
        dots[currentSlide].classList.add('active');
        dots[currentSlide].setAttribute('aria-current', 'true');
        
        // Update aria-label for slide groups
        items.forEach((item, idx) => {
            item.setAttribute('aria-label', `Slide ${idx + 1} of ${items.length}`);
        });
    }

    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }

    function startInterval() {
        slideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000); // Change slide every 5 seconds
    }

    // Start the carousel
    startInterval();

    // Performance improvement: Use a more efficient approach for pausing on hover
    const pauseCarousel = () => clearInterval(slideInterval);
    const resumeCarousel = () => {
        clearInterval(slideInterval);
        startInterval();
    };
    
    // Pause carousel on hover (desktop only)
    if (!isMobile) {
        carousel.addEventListener('mouseenter', pauseCarousel);
        carousel.addEventListener('mouseleave', resumeCarousel);
    }
    
    // Use efficient event listener for window resize
    const handleResize = () => {
        isMobile = window.innerWidth < 768;
    };
    
    // Throttle resize event for better performance
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 200);
    });
    
    // Initial setup ensures all content is properly accessible
    showSlide(0);
}
};

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    MDL.init();
    MDL.handleForms();
});