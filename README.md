// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const header = document.getElementById('header');
const addCertBtn = document.getElementById('add-cert-btn');
const certModal = document.getElementById('cert-modal');
const closeModal = document.getElementById('close-modal');
const certForm = document.getElementById('cert-form');
const certificationsGrid = document.getElementById('certifications-grid');
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

// Certifications Management
let certifications = JSON.parse(localStorage.getItem('certifications')) || [];

// Modal functions
addCertBtn?.addEventListener('click', () => {
    certModal.style.display = 'block';
});

closeModal?.addEventListener('click', () => {
    certModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === certModal) {
        certModal.style.display = 'none';
    }
});

// Certificate form submission
certForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(certForm);
    const certification = {
        id: Date.now(),
        pilotName: document.getElementById('pilot-name').value,
        certType: document.getElementById('cert-type').value,
        issueDate: document.getElementById('issue-date').value,
        expiryDate: document.getElementById('expiry-date').value,
        file: document.getElementById('cert-file').files[0]?.name || null
    };
    
    certifications.push(certification);
    localStorage.setItem('certifications', JSON.stringify(certifications));
    
    renderCertifications();
    certModal.style.display = 'none';
    certForm.reset();
    
    showMessage('Certificação adicionada com sucesso!', 'success');
});

// Render certifications
function renderCertifications() {
    if (!certificationsGrid) return;
    
    certificationsGrid.innerHTML = '';
    
    if (certifications.length === 0) {
        certificationsGrid.innerHTML = `
            <div class="no-certifications">
                <p>Nenhuma certificação cadastrada ainda.</p>
                <p>Clique em "Adicionar Certificação" para começar.</p>
            </div>
        `;
        return;
    }
    
    certifications.forEach(cert => {
        const certCard = createCertificationCard(cert);
        certificationsGrid.appendChild(certCard);
    });
}

// Create certification card
function createCertificationCard(cert) {
    const card = document.createElement('div');
    card.className = 'cert-card';
    
    const status = getCertificationStatus(cert.expiryDate);
    const statusClass = getStatusClass(status);
    
    card.innerHTML = `
        <div class="cert-status ${statusClass}">${status}</div>
        <div class="cert-header">
            <div>
                <h4>${cert.pilotName}</h4>
                <p><strong>Tipo:</strong> ${cert.certType}</p>
            </div>
            <div class="cert-actions">
                <button class="btn btn-small btn-danger" onclick="deleteCertification(${cert.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="cert-details">
            <p><strong>Emissão:</strong> ${formatDate(cert.issueDate)}</p>
            <p><strong>Validade:</strong> ${formatDate(cert.expiryDate)}</p>
            ${cert.file ? `<p><strong>Arquivo:</strong> ${cert.file}</p>` : ''}
        </div>
    `;
    
    return card;
}

// Get certification status
function getCertificationStatus(expiryDate) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
        return 'Expirado';
    } else if (daysUntilExpiry <= 30) {
        return 'Expira em breve';
    } else {
        return 'Válido';
    }
}

// Get status CSS class
function getStatusClass(status) {
    switch (status) {
        case 'Válido': return 'status-valid';
        case 'Expira em breve': return 'status-expiring';
        case 'Expirado': return 'status-expired';
        default: return 'status-valid';
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Delete certification
function deleteCertification(id) {
    if (confirm('Tem certeza que deseja excluir esta certificação?')) {
        certifications = certifications.filter(cert => cert.id !== id);
        localStorage.setItem('certifications', JSON.stringify(certifications));
        renderCertifications();
        showMessage('Certificação excluída com sucesso!', 'success');
    }
}

// Contact form submission
contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulate form submission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<div class="loading"></div> Enviando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        contactForm.reset();
        showMessage('Solicitação enviada com sucesso! Entraremos em contato em breve.', 'success');
    }, 2000);
});

// Show message function
function showMessage(text, type) {
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
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.service-card, .drone-card, .metric-card, .contact-item').forEach(el => {
        observer.observe(el);
    });
}

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent.replace(/\D/g, ''));
                const suffix = counter.textContent.replace(/\d/g, '');
                
                animateCounter(counter, target, suffix);
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
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 30);
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
        const phoneRegex = /^\$\d{2}\$\s\d{4,5}-\d{4}$/;
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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    renderCertifications();
    createScrollTopButton();
    setupScrollAnimations();
    animateCounters();
    setupFormValidation();
    setupPhoneFormatting();
    
    // Add some sample certifications if none exist
    if (certifications.length === 0) {
        const sampleCerts = [
            {
                id: 1,
                pilotName: 'João Silva',
                certType: 'ANAC',
                issueDate: '2023-01-15',
                expiryDate: '2025-01-15',
                file: 'certificado_joao_anac.pdf'
            },
            {
                id: 2,
                pilotName: 'Maria Santos',
                certType: 'MAPA',
                issueDate: '2023-03-20',
                expiryDate: '2024-12-20',
                file: 'certificado_maria_mapa.pdf'
            }
        ];
        
        certifications = sampleCerts;
        localStorage.setItem('certifications', JSON.stringify(certifications));
        renderCertifications();
    }
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Erro na aplicação:', e.error);
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registrado com sucesso:', registration);
            })
            .catch(registrationError => {
                console.log('Falha no registro do SW:', registrationError);
            });
    });
}