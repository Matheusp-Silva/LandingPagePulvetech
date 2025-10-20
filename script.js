// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const header = document.getElementById('header');
const contactForm = document.getElementById('contact-form');

// Mobile Navigation Toggle
navToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth scrolling for anchor links
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

// Contact form submission (simple version without API)
contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    try {
        // Simulate form submission (replace with your actual form handler)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Success
        contactForm.reset();
        showMessage('Solicitação enviada com sucesso! Entraremos em contato em breve.', 'success');
        
    } catch (error) {
        showMessage('Erro ao enviar solicitação. Tente novamente.', 'error');
    } finally {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Show message function
function showMessage(text, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    const message = document.createElement('div');
    message.className = `message message-${type}`;
    message.textContent = text;
    
    // Insert message at the top of the page
    document.body.insertBefore(message, document.body.firstChild);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        message.remove();
    }, 5000);
}

// Scroll to top button
function createScrollTopButton() {
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.setAttribute('aria-label', 'Voltar ao topo');
    
    document.body.appendChild(scrollTopBtn);
    
    // Show/hide scroll top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
    
    // Scroll to top functionality
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Intersection Observer for animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target); // Stop observing after animation
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.service-card, .drone-card, .metric-card, .about-card, .guideline-card').forEach(el => {
        observer.observe(el);
    });
}

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number, .metric-value');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const text = counter.textContent;
                const target = parseInt(text.replace(/\D/g, ''));
                
                if (target > 0) {
                    const suffix = text.replace(/[\d.]/g, '');
                    animateCounter(counter, target, suffix);
                }
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Animate counter function
function animateCounter(element, target, suffix) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000; // 2 seconds
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, stepTime);
}

// Form validation
function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearValidation);
        });
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing validation classes
    field.classList.remove('valid', 'invalid');
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(value)) {
            field.classList.add('valid');
        } else {
            field.classList.add('invalid');
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        if (phoneRegex.test(value)) {
            field.classList.add('valid');
        } else {
            field.classList.add('invalid');
        }
    }
    
    // Required field validation
    if (field.hasAttribute('required')) {
        if (value) {
            field.classList.add('valid');
        } else {
            field.classList.add('invalid');
        }
    }
}

function clearValidation(e) {
    const field = e.target;
    field.classList.remove('invalid');
}

// Phone number formatting
function setupPhoneFormatting() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length >= 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 10) {
                value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 6) {
                value = value.replace(/(\d{2})(\d{4})/, '($1) $2');
            } else if (value.length >= 2) {
                value = value.replace(/(\d{2})/, '($1) ');
            }
            
            e.target.value = value;
        });
    });
}

// Dropdown menu enhancement for mobile
function setupDropdownMenus() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        
        // Handle mobile touch events
        dropdown.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdownMenu.style.display = 'none';
            }
        });
    });
}

// Performance optimization: Lazy loading for images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Enhanced form submission with better UX
function enhanceFormSubmission() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const submitBtn = form.querySelector('button[type="submit"]');
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            // Validate all required fields
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('invalid');
                    isValid = false;
                } else {
                    field.classList.remove('invalid');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createScrollTopButton();
    setupScrollAnimations();
    setupFormValidation();
    setupPhoneFormatting();
    setupDropdownMenus();
    setupLazyLoading();
    enhanceFormSubmission();
    
    // Animate counters after a short delay
    setTimeout(() => {
        animateCounters();
    }, 500);
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Erro na aplicação:', e.error);
    // Only show user-friendly errors in production
    if (window.location.hostname !== 'localhost') {
        showMessage('Ocorreu um erro inesperado. Tente recarregar a página.', 'error');
    }
});

// Handle offline/online status
window.addEventListener('online', () => {
    showMessage('Conexão com a internet restaurada.', 'success');
});

window.addEventListener('offline', () => {
    showMessage('Você está offline. Algumas funcionalidades podem não funcionar.', 'error');
});

// Prevent form resubmission on page refresh
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}