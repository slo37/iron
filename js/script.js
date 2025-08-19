// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('mobile-active');
            mobileToggle.classList.toggle('active');
        });
    }

    // Product showcase slider
    const slides = document.querySelectorAll('.product-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;

    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        if (slides[n]) {
            slides[n].classList.add('active');
        }
        if (indicators[n]) {
            indicators[n].classList.add('active');
        }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    // Event listeners for slider controls
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }

    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Auto-play slider
    if (slides.length > 0) {
        setInterval(nextSlide, 5000);
        showSlide(0); // Show first slide initially
    }

    // Product detail image gallery
    const mainImage = document.querySelector('.main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const galleryPrev = document.querySelector('.gallery-prev');
    const galleryNext = document.querySelector('.gallery-next');
    let currentImageIndex = 0;

    if (thumbnails.length > 0) {
        // Set initial active thumbnail
        thumbnails[0].classList.add('active');

        thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => {
                if (mainImage) {
                    mainImage.src = thumbnail.src;
                }
                thumbnails.forEach(t => t.classList.remove('active'));
                thumbnail.classList.add('active');
                currentImageIndex = index;
            });
        });

        if (galleryPrev) {
            galleryPrev.addEventListener('click', () => {
                currentImageIndex = (currentImageIndex - 1 + thumbnails.length) % thumbnails.length;
                thumbnails[currentImageIndex].click();
            });
        }

        if (galleryNext) {
            galleryNext.addEventListener('click', () => {
                currentImageIndex = (currentImageIndex + 1) % thumbnails.length;
                thumbnails[currentImageIndex].click();
            });
        }
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            if (!data.name || !data.email || !data.message) {
                alert('Veuillez remplir tous les champs obligatoires.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                alert('Veuillez entrer une adresse email valide.');
                return;
            }
            
            // Simulate form submission
            alert('Merci pour votre message ! Nous vous contacterons bientôt.');
            this.reset();
        });
    }

    // Add scroll effect to header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});

// Navigation functionality
/*
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Add click handlers for smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
            
            // Update active nav link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        const headerHeight = document.querySelector('.header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}
*/

// Animation functionality
function initializeAnimations() {
    // Fade in animation for elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements that should animate
    const animateElements = document.querySelectorAll(
        '.section-header, .feature-item, .product-card, .team-card, .testimonial-card'
    );

    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Hero indicators animation
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function () {
            indicators.forEach(ind => ind.classList.remove('active'));
            this.classList.add('active');

            // You could add logic here to change hero content
            console.log(`Indicator ${index + 1} clicked`);
        });
    });

    // Product card hover effects
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) rotateY(5deg)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) rotateY(0)';
        });
    });
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const formValues = {};

            // Get all input values
            const inputs = this.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                formValues[input.name || input.placeholder] = input.value;
            });

            // Validate form
            if (validateContactForm(formValues)) {
                // Show success message
                showNotification('Message envoyé avec succès!', 'success');

                // Reset form
                this.reset();

                // You can add actual form submission logic here
                console.log('Form submitted:', formValues);

                // For demo, simulate sending to WhatsApp
                setTimeout(() => {
                    const message = encodeURIComponent(
                        `Nouveau message de contact:\n\n` +
                        `Nom: ${formValues['Prénom & Nom'] || ''}\n` +
                        `Email: ${formValues['Email'] || ''}\n` +
                        `Adresse: ${formValues['Addresse'] || ''}\n` +
                        `Message: ${formValues['Message'] || ''}`
                    );

                    // Uncomment to open WhatsApp
                    // window.open(`https://wa.me/21653583583?text=${message}`, '_blank');
                }, 1000);
            }
        });
    }
}

// Form validation
function validateContactForm(values) {
    const requiredFields = ['Prénom & Nom', 'Email', 'Message'];
    let isValid = true;

    requiredFields.forEach(field => {
        if (!values[field] || values[field].trim() === '') {
            showNotification(`Le champ ${field} est obligatoire`, 'error');
            isValid = false;
        }
    });

    // Email validation
    if (values['Email'] && !isValidEmail(values['Email'])) {
        showNotification('Veuillez entrer une adresse email valide', 'error');
        isValid = false;
    }

    return isValid;
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '5px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });

    // Set background color based on type
    const colors = {
        success: '#2ECC71',
        error: '#E74C3C',
        info: '#3498DB'
    };
    notification.style.backgroundColor = colors[type] || colors['info'];

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });
    }
}

// Scroll effects
function initializeScrollEffects() {
    let lastScrollTop = 0;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Header background opacity based on scroll
        if (scrollTop > 100) {
            header.style.background = 'rgba(44, 62, 80, 0.98)';
        } else {
            header.style.background = 'rgba(44, 62, 80, 0.95)';
        }

        // Hide/show header on scroll (optional)
        /*
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        */

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // Parallax effect for hero shapes
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.hero-shapes .shape-1, .hero-shapes .shape-2');

        shapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.2);
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Loading screen
function initializeLoading() {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = '<div class="spinner"></div>';

    document.body.appendChild(loading);

    // Hide loading screen when page is fully loaded
    window.addEventListener('load', function () {
        setTimeout(() => {
            loading.classList.add('hidden');
            setTimeout(() => {
                if (loading.parentNode) {
                    loading.parentNode.removeChild(loading);
                }
            }, 500);
        }, 1000);
    });
}

// Emoji reaction functionality
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('emoji')) {
        // Animate emoji
        e.target.style.transform = 'scale(1.5)';
        setTimeout(() => {
            e.target.style.transform = 'scale(1)';
        }, 200);

        // Show reaction effect
        showEmojiReaction(e.target.textContent, e.clientX, e.clientY);
    }
});

function showEmojiReaction(emoji, x, y) {
    const reaction = document.createElement('div');
    reaction.textContent = emoji;
    reaction.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: 24px;
        pointer-events: none;
        z-index: 10000;
        animation: emojiFloat 1s ease-out forwards;
    `;

    // Add animation keyframes if not exists
    if (!document.querySelector('#emoji-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'emoji-animation-styles';
        style.textContent = `
            @keyframes emojiFloat {
                0% {
                    transform: translateY(0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translateY(-50px) scale(1.5);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(reaction);

    setTimeout(() => {
        if (reaction.parentNode) {
            reaction.parentNode.removeChild(reaction);
        }
    }, 1000);
}

// Button click effects
document.addEventListener('click', function (e) {
    const button = e.target.closest('button, .hero-btn, .whatsapp-btn');
    if (button) {
        // Ripple effect
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        // Add ripple animation if not exists
        if (!document.querySelector('#ripple-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
});

// Keyboard navigation
document.addEventListener('keydown', function (e) {
    // ESC key to close mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const mobileToggle = document.querySelector('.mobile-toggle');

        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
        }
    }

    // Arrow keys for hero indicators
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const indicators = document.querySelectorAll('.indicator');
        const activeIndex = Array.from(indicators).findIndex(ind =>
            ind.classList.contains('active')
        );

        if (activeIndex !== -1) {
            indicators[activeIndex].classList.remove('active');

            let newIndex;
            if (e.key === 'ArrowLeft') {
                newIndex = activeIndex > 0 ? activeIndex - 1 : indicators.length - 1;
            } else {
                newIndex = activeIndex < indicators.length - 1 ? activeIndex + 1 : 0;
            }

            indicators[newIndex].classList.add('active');
        }
    }
});

// Performance optimization
let ticking = false;

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateAnimations);
        ticking = true;
    }
}

function updateAnimations() {
    // Update any scroll-based animations here
    ticking = false;
}

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const smoothScrollPolyfill = document.createElement('script');
    smoothScrollPolyfill.src = 'https://cdn.jsdelivr.net/gh/iamdustan/smoothscroll@master/dist/smoothscroll.min.js';
    document.head.appendChild(smoothScrollPolyfill);
}

// Product Showcase Slider functionality
function initializeProductSlider() {
    const slides = document.querySelectorAll('.product-slide');
    const indicators = document.querySelectorAll('.hero-indicators .indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    const slideCount = slides.length;

    // Initialize the slider
    function showSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // Add active class to current slide and indicator
        slides[index].classList.add('active');
        indicators[index].classList.add('active');

        // Update current slide index
        currentSlide = index;
    }

    // Next slide function
    function nextSlide() {
        let newIndex = currentSlide + 1;
        if (newIndex >= slideCount) {
            newIndex = 0;
        }
        showSlide(newIndex);
    }

    // Previous slide function
    function prevSlide() {
        let newIndex = currentSlide - 1;
        if (newIndex < 0) {
            newIndex = slideCount - 1;
        }
        showSlide(newIndex);
    }

    // Set up event listeners for buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            prevSlide();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            nextSlide();
        });
    }

    // Set up event listeners for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function () {
            showSlide(index);
        });
    });

    // Auto-rotate slides every 5 seconds
    setInterval(nextSlide, 5000);
}

// Console welcome message
console.log(`
🔥 IRON Welding Company Website
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Site web entièrement fonctionnel
✅ Design responsive et moderne  
✅ Animations fluides et interactives
✅ Formulaire de contact intégré
✅ Navigation smooth scroll
✅ Effets de survol avancés

🛠️ Développé avec HTML5, CSS3 et JavaScript
📱 Compatible mobile et desktop
🚀 Optimisé pour les performances

Contact: +216 53 583 583
Email: Contact@iron.tn
`);

// Export functions for external use (if needed)
window.IronWebsite = {
    showNotification,
    validateContactForm,
    initializeNavigation,
    initializeAnimations
};