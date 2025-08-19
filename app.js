// --- UTILITY FUNCTIONS ---

/**
 * Throttles a function to limit how often it can be executed.
 * @param {Function} func The function to throttle.
 * @param {number} limit The minimum time in milliseconds between executions.
 * @returns {Function} The throttled function.
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// --- SCROLL-DEPENDENT HANDLERS ---

const header = document.querySelector('.site-header');
const heroShapes = document.querySelectorAll('.hero-shape');
const scrollIndicator = document.querySelector('.scroll-indicator');

// Handles the header background change on scroll
function handleHeaderScroll() {
    if (window.scrollY > 50) {
        header.style.background = 'rgba(26, 26, 26, 0.98)';
        header.style.backdropFilter = 'blur(15px)';
    } else {
        header.style.background = 'rgba(26, 26, 26, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    }
}

// Handles the parallax effect for hero shapes
function handleParallaxEffects() {
    const scrollY = window.scrollY;
    heroShapes.forEach((shape, index) => {
        const speed = 0.1 + (index * 0.05); // Reduced speed for subtlety
        const yPos = -(scrollY * speed);
        shape.style.transform = `translateY(${yPos}px)`;
    });
}

// Highlights the active navigation link based on scroll position
function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    let current = 'home'; // Default to home

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - header.offsetHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Hides the scroll-down indicator after the user has scrolled
function handleScrollIndicator() {
     if (window.scrollY > 100) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
    } else {
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.pointerEvents = 'auto';
    }
}

// --- INITIALIZATION FUNCTIONS ---

function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navLinkItems = document.querySelectorAll('.nav-links a');

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking on links
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}

function initScrollAnimations() {
    const animateElements = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, parseInt(delay));
                
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.1 });

    animateElements.forEach(element => {
        observer.observe(element);
    });
}

function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.8 });

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const duration = 1500; // Animate over 1.5 seconds
    const stepTime = 20; // Update every 20ms
    const totalSteps = duration / stepTime;
    const increment = target / totalSteps;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, stepTime);
}

function initTestimonials() {
    const track = document.getElementById('testimonialTrack');
    if (!track) return; // Exit if testimonials not on page
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    let currentSlide = 0;
    const totalSlides = indicators.length;

    function updateSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(${-currentSlide * 100}%)`;
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === currentSlide);
        });
    }

    function nextSlide() {
        updateSlide((currentSlide + 1) % totalSlides);
    }
    
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', () => updateSlide((currentSlide - 1 + totalSlides) % totalSlides));
    indicators.forEach((indicator, index) => indicator.addEventListener('click', () => updateSlide(index)));

    setInterval(nextSlide, 6000); // Auto-play
}

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offset = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    scrollIndicator.addEventListener('click', () => {
        document.querySelector('#services').scrollIntoView({ behavior: 'smooth' });
    });
}


// --- MAIN EXECUTION ---

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive components
    initNavigation();
    initScrollAnimations();
    initCounters();
    initTestimonials();
    initSmoothScrolling();
    
    // Initial check for scroll-based states
    handleHeaderScroll();
    highlightActiveNavLink();
    handleScrollIndicator();

    // Setup a single, throttled scroll listener for performance
    const masterScrollHandler = () => {
        handleHeaderScroll();
        handleParallaxEffects();
        highlightActiveNavLink();
        handleScrollIndicator();
    };
    
    // Throttle rate of 16ms is roughly 60fps for smooth animations
    window.addEventListener('scroll', throttle(masterScrollHandler, 16));
});