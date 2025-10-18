// Configuração da API
const API_BASE_URL = 'http://localhost:3000/api';

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

// API Functions
class DronesPulvetechAPI {
    static async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Certificações
    static async getCertifications() {
        return this.request('/certifications');
    }

    static async createCertification(data) {
        return this.request('/certifications', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    static async deleteCertification(id) {
        return this.request(`/certifications/${id}`, {
            method: 'DELETE'
        });
    }

    // Contatos
    static async createContact(data) {
        return this.request('/contacts', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Drones
    static async getDrones() {
        return this.request('/drones');
    }

    // Estatísticas
    static async getStatistics() {
        return this.request('/statistics');
    }

    // Upload de arquivo
    static async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Upload error! status: ${response.status}`);
        }

        return await response.json();
    }
}

// Certificações Management
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
certForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const submitBtn = certForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="loading"></div> Salvando...';

        let filePath = null;

        // Upload do arquivo se existir
        const fileInput = document.getElementById('cert-file');
        if (fileInput.files[0]) {
            const uploadResult = await DronesPulvetechAPI.uploadFile(fileInput.files[0]);
            filePath = uploadResult.path;
        }

        const certification = {
            pilot_name: document.getElementById('pilot-name').value,
            cert_type: document.getElementById('cert-type').value,
            issue_date: document.getElementById('issue-date').value,
            expiry_date: document.getElementById('expiry-date').value,
            file_path: filePath
        };
        
        await DronesPulvetechAPI.createCertification(certification);
        
        await loadCertifications();
        certModal.style.display = 'none';
        certForm.reset();
        
        showMessage('Certificação adicionada com sucesso!', 'success');
    } catch (error) {
        showMessage('Erro ao adicionar certificação: ' + error.message, 'error');
    } finally {
        const submitBtn = certForm.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Salvar Certificação';
    }
});

// Load certifications from database
async function loadCertifications() {
    if (!certificationsGrid) return;
    
    try {
        const certifications = await DronesPulvetechAPI.getCertifications();
        renderCertifications(certifications);
    } catch (error) {
        console.error('Erro ao carregar certificações:', error);
        certificationsGrid.innerHTML = `
            <div class="error-message">
                <p>Erro ao carregar certificações. Verifique se o servidor está rodando.</p>
            </div>
        `;
    }
}

// Render certifications
function renderCertifications(certifications) {
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
    
    const statusText = getStatusText(cert.validation_status);
    const statusClass = getStatusClass(cert.validation_status);
    
    card.innerHTML = `
        <div class="cert-status ${statusClass}">${statusText}</div>
        <div class="cert-header">
            <div>
                <h4>${cert.pilot_name}</h4>
                <p><strong>Tipo:</strong> ${cert.cert_type}</p>
            </div>
            <div class="cert-actions">
                <button class="btn btn-small btn-danger" onclick="deleteCertification(${cert.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="cert-details">
            <p><strong>Emissão:</strong> ${formatDate(cert.issue_date)}</p>
            <p><strong>Validade:</strong> ${formatDate(cert.expiry_date)}</p>
            ${cert.file_path ? `<p><strong>Arquivo:</strong> <a href="${cert.file_path}" >Ver certificado</a></p>` : ''}
        </div>
    `;
    
    return card;
}

// Get status text
function getStatusText(status) {
    switch (status) {
        case 'valid': return 'Válido';
        case 'expiring_soon': return 'Expira em breve';
        case 'expired': return 'Expirado';
        default: return 'Válido';
    }
}

// Get status CSS class
function getStatusClass(status) {
    switch (status) {
        case 'valid': return 'status-valid';
        case 'expiring_soon': return 'status-expiring';
        case 'expired': return 'status-expired';
        default: return 'status-valid';
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Delete certification
async function deleteCertification(id) {
    if (confirm('Tem certeza que deseja excluir esta certificação?')) {
        try {
            await DronesPulvetechAPI.deleteCertification(id);
            await loadCertifications();
            showMessage('Certificação excluída com sucesso!', 'success');
        } catch (error) {
            showMessage('Erro ao excluir certificação: ' + error.message, 'error');
        }
    }
}

// Contact form submission
contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<div class="loading"></div> Enviando...';
        submitBtn.disabled = true;
        
        const formData = new FormData(contactForm);
        const contactData = {
            name: formData.get('name') || contactForm.querySelector('input[placeholder="Nome Completo"]').value,
            email: formData.get('email') || contactForm.querySelector('input[placeholder="E-mail"]').value,
            phone: formData.get('phone') || contactForm.querySelector('input[placeholder="Telefone"]').value,
            property_name: formData.get('property') || contactForm.querySelector('input[placeholder="Propriedade/Fazenda"]').value,
            area_hectares: formData.get('area') || contactForm.querySelector('input[placeholder="Área (hectares)"]').value,
            application_type: formData.get('application_type') || contactForm.querySelector('select').value,
            observations: formData.get('observations') || contactForm.querySelector('textarea').value
        };
        
        await DronesPulvetechAPI.createContact(contactData);
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        contactForm.reset();
        showMessage('Solicitação enviada com sucesso! Entraremos em contato em breve.', 'success');
    } catch (error) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.innerHTML = 'Enviar Solicitação';
        submitBtn.disabled = false;
        showMessage('Erro ao enviar solicitação: ' + error.message, 'error');
    }
});

// Load and display drones
async function loadDrones() {
    try {
        const drones = await DronesPulvetechAPI.getDrones();
        renderDrones(drones);
    } catch (error) {
        console.error('Erro ao carregar drones:', error);
    }
}

// Render drones
function renderDrones(drones) {
    const dronesGrid = document.querySelector('.drones-grid');
    if (!dronesGrid) return;
    
    dronesGrid.innerHTML = '';
    
    drones.forEach(drone => {
        const droneCard = createDroneCard(drone);
        dronesGrid.appendChild(droneCard);
    });
}

// Create drone card
function createDroneCard(drone) {
    const card = document.createElement('div');
    card.className = 'drone-card';
    
    card.innerHTML = `
        <div class="drone-image">
            ${drone.image_path ? 
                `<img src="${drone.image_path}" alt="${drone.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">` :
                `<i class="fas fa-drone"></i>`
            }
        </div>
        <h4>${drone.name}</h4>
        <p class="drone-model">${drone.model}</p>
        <div class="drone-specs">
            <div class="spec-item">
                <span class="spec-label">Capacidade:</span>
                <span class="spec-value">${drone.capacity}L</span>
            </div>
            <div class="spec-item">
                <span class="spec-label">Autonomia:</span>
                <span class="spec-value">${drone.autonomy} min</span>
            </div>
            <div class="spec-item">
                <span class="spec-label">Área/voo:</span>
                <span class="spec-value">${drone.area_per_flight} hectares</span>
            </div>
            <div class="spec-item">
                <span class="spec-label">Aplicação:</span>
                <span class="spec-value">${drone.application_type}</span>
            </div>
        </div>
        ${drone.specifications && Object.keys(drone.specifications).length > 0 ? `
            <div class="drone-additional-specs">
                <h5>Especificações Técnicas:</h5>
                ${Object.entries(drone.specifications).map(([key, value]) => `
                    <div class="spec-item">
                        <span class="spec-label">${key}:</span>
                        <span class="spec-value">${value}</span>
                    </div>
                `).join('')}
            </div>
        ` : ''}
    `;
    
    return card;
}

// Load and display statistics
async function loadStatistics() {
    try {
        const statistics = await DronesPulvetechAPI.getStatistics();
        renderStatistics(statistics);
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

// Render statistics
function renderStatistics(statistics) {
    // Update home stats
    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) {
        const homeStats = statistics.filter(stat => 
            ['total_drones', 'certified_pilots', 'hectares_served', 'years_experience'].includes(stat.metric_name)
        );
        
        statsGrid.innerHTML = '';
        homeStats.forEach(stat => {
            const statItem = document.createElement('div');
            statItem.className = 'stat-item';
            statItem.innerHTML = `
                <div class="stat-number">${stat.metric_value}${stat.metric_unit}</div>
                <div class="stat-label">${stat.description}</div>
            `;
            statsGrid.appendChild(statItem);
        });
    }
    
    // Update quality metrics
    const metricsGrid = document.querySelector('.metrics-grid');
    if (metricsGrid) {
        const qualityStats = statistics.filter(stat => 
            ['precision', 'economy', 'coverage', 'time_reduction'].includes(stat.metric_name)
        );
        
        const metricCards = metricsGrid.querySelectorAll('.metric-card');
        qualityStats.forEach((stat, index) => {
            if (metricCards[index]) {
                const valueElement = metricCards[index].querySelector('.metric-value');
                if (valueElement) {
                    valueElement.textContent = stat.metric_value + stat.metric_unit;
                }
            }
        });
    }
}

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

// Connection status indicator
function setupConnectionStatus() {
    const statusIndicator = document.createElement('div');
    statusIndicator.className = 'connection-status';
    statusIndicator.innerHTML = '<i class="fas fa-wifi"></i> <span>Conectado</span>';
    
    // Add to header
    const nav = document.querySelector('.nav');
    if (nav) {
        nav.appendChild(statusIndicator);
    }
    
    // Check connection periodically
    setInterval(async () => {
        try {
            await DronesPulvetechAPI.getStatistics();
            statusIndicator.className = 'connection-status connected';
            statusIndicator.innerHTML = '<i class="fas fa-wifi"></i> <span>Conectado</span>';
        } catch (error) {
            statusIndicator.className = 'connection-status disconnected';
            statusIndicator.innerHTML = '<i class="fas fa-wifi-slash"></i> <span>Desconectado</span>';
        }
    }, 30000); // Check every 30 seconds
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    createScrollTopButton();
    setupScrollAnimations();
    setupFormValidation();
    setupPhoneFormatting();
    setupConnectionStatus();
    
    // Load data from database
    await loadCertifications();
    await loadDrones();
    await loadStatistics();
    
    // Animate counters after loading stats
    setTimeout(() => {
        animateCounters();
    }, 500);
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Erro na aplicação:', e.error);
    showMessage('Ocorreu um erro inesperado. Verifique o console para mais detalhes.', 'error');
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

