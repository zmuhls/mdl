// Mobile menu toggle with accessibility improvements
document.getElementById('navToggle').addEventListener('click', function() {
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

// Initialize carousel functionality if one exists on the page
function initCarousel(carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    
    const items = carousel.querySelectorAll('.carousel-inner .item');
    const navContainer = carousel.querySelector('.carousel-nav');
    let currentSlide = 0;
    let slideInterval;
    
    // Create navigation dots
    items.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
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

    function showSlide(index) {
        // Remove active class from all items and dots
        items.forEach(item => item.classList.remove('active'));
        const dots = navContainer.querySelectorAll('.carousel-dot');
        dots.forEach(dot => dot.classList.remove('active'));

        // Handle wrap-around
        currentSlide = index;
        if (currentSlide >= items.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = items.length - 1;

        // Show new active slide and dot
        items[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
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

    // Pause carousel on hover
    carousel.addEventListener('mouseenter', () => clearInterval(slideInterval));
    carousel.addEventListener('mouseleave', startInterval);
}