// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Active Navigation Link on Scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Navbar Background on Scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
});

// Skill Bars Animation
const skillBars = document.querySelectorAll('.skill-progress');
const animateSkillBars = () => {
    skillBars.forEach(bar => {
        const rect = bar.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && bar.style.width === '0px' || !bar.style.width) {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = progress + '%';
        }
    });
};

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Animate skill bars when in viewport
    window.addEventListener('scroll', animateSkillBars);
    animateSkillBars(); // Check on load
    
    // Add fade-in animation to various elements
    const animatedElements = document.querySelectorAll('.project-card, .skill-category, .stat-item, .about-text, .contact-info, .contact-form');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Typing Effect for Hero Title (Single Line)
const heroNameEl = document.querySelector('.hero-title-name');
if (heroNameEl) {
    const fullName = heroNameEl.getAttribute('data-text') || '';
    heroNameEl.textContent = '';
    let nameIndex = 0;

    function typeHeroName() {
        if (nameIndex <= fullName.length) {
            heroNameEl.textContent = fullName.slice(0, nameIndex);
            nameIndex++;
            setTimeout(typeHeroName, 70);
        }
    }

    window.addEventListener('load', () => {
        setTimeout(typeHeroName, 500);
    });
}

// Smooth Scroll for Navigation Links
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

const starsCanvas = document.getElementById('starsCanvas');
if (starsCanvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = starsCanvas.getContext('2d');
    let stars = [];
    let animationFrameId;

    function resizeStarsCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = starsCanvas.getBoundingClientRect();
        starsCanvas.width = Math.max(1, Math.floor(rect.width * dpr));
        starsCanvas.height = Math.max(1, Math.floor(rect.height * dpr));
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const targetCount = Math.min(140, Math.max(70, Math.floor((rect.width * rect.height) / 9000)));
        stars = Array.from({ length: targetCount }, () => createStar(rect.width, rect.height));
    }

    function createStar(w, h) {
        const baseR = Math.random() * 1.6 + 0.4;
        return {
            x: Math.random() * w,
            y: Math.random() * h,
            r: baseR,
            a: Math.random() * 0.7 + 0.2,
            tw: Math.random() * 0.02 + 0.005,
            s: Math.random() * 0.25 + 0.05,
            p: Math.random() * Math.PI * 2
        };
    }

    function drawStars(w, h) {
        ctx.clearRect(0, 0, w, h);

        const grad = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.7);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        for (const st of stars) {
            const twinkle = 0.45 + 0.55 * Math.sin(st.p);
            const alpha = Math.max(0, Math.min(1, st.a * twinkle));

            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
            ctx.fill();

            if (st.r > 1.4) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(99, 102, 241, ${alpha * 0.35})`;
                ctx.lineWidth = 1;
                ctx.moveTo(st.x - st.r * 3, st.y);
                ctx.lineTo(st.x + st.r * 3, st.y);
                ctx.moveTo(st.x, st.y - st.r * 3);
                ctx.lineTo(st.x, st.y + st.r * 3);
                ctx.stroke();
            }
        }
    }

    function tickStars() {
        const rect = starsCanvas.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;

        for (const st of stars) {
            st.p += st.tw;
            st.y += st.s;
            if (st.y > h + 20) {
                st.y = -20;
                st.x = Math.random() * w;
            }
        }

        drawStars(w, h);
        animationFrameId = requestAnimationFrame(tickStars);
    }

    function startStars() {
        cancelAnimationFrame(animationFrameId);
        resizeStarsCanvas();
        tickStars();
    }

    window.addEventListener('resize', () => {
        startStars();
    });

    window.addEventListener('load', () => {
        startStars();
    });
}

// Enhanced Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    // Add input animations
    const formInputs = contactForm.querySelectorAll('input, textarea');
    
    formInputs.forEach(input => {
        // Add floating label effect
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Add character counter for textarea
        if (input.tagName === 'TEXTAREA') {
            const counter = document.createElement('div');
            counter.className = 'char-counter';
            counter.style.cssText = `
                font-size: 0.85rem;
                color: #64748b;
                text-align: right;
                margin-top: 5px;
                transition: color 0.3s ease;
            `;
            
            function updateCounter() {
                const length = input.value.length;
                const maxLength = 500;
                counter.textContent = `${length}/${maxLength}`;
                
                if (length > maxLength * 0.9) {
                    counter.style.color = '#ef4444';
                } else if (length > maxLength * 0.7) {
                    counter.style.color = '#f59e0b';
                } else {
                    counter.style.color = '#64748b';
                }
            }
            
            input.addEventListener('input', updateCounter);
            input.parentElement.appendChild(counter);
            updateCounter();
        }
    });
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Enhanced validation
        const errors = [];
        
        if (!formData.name || formData.name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
        }
        
        if (!formData.email) {
            errors.push('Email is required');
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                errors.push('Please enter a valid email address');
            }
        }
        
        if (!formData.subject || formData.subject.trim().length < 3) {
            errors.push('Subject must be at least 3 characters long');
        }
        
        if (!formData.message || formData.message.trim().length < 10) {
            errors.push('Message must be at least 10 characters long');
        }
        
        if (errors.length > 0) {
            showNotification(errors[0], 'error');
            return;
        }
        
        // Enhanced submit animation
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;
        
        submitBtn.innerHTML = `
            <span style="display: inline-block; animation: spin 1s linear infinite;">⚪</span>
            Sending...
        `;
        submitBtn.disabled = true;
        submitBtn.style.cursor = 'not-allowed';
        
        // Simulate form submission
        setTimeout(() => {
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
            
            // Reset button with success animation
            submitBtn.innerHTML = '✓ Message Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalContent;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                submitBtn.style.cursor = 'pointer';
            }, 2000);
        }, 2000);
    });
}

// Enhanced Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Add icon based on type
    let icon = '';
    switch(type) {
        case 'success':
            icon = '✓';
            break;
        case 'error':
            icon = '✕';
            break;
        default:
            icon = 'ℹ';
    }
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icon}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add enhanced styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        min-width: 300px;
        max-width: 400px;
        border-radius: 12px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(450px);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10px);
        overflow: hidden;
    `;
    
    // Set background and gradient based on type
    let gradient = '';
    switch(type) {
        case 'success':
            gradient = 'linear-gradient(135deg, #10B981, #059669)';
            break;
        case 'error':
            gradient = 'linear-gradient(135deg, #EF4444, #DC2626)';
            break;
        default:
            gradient = 'linear-gradient(135deg, #6366F1, #4F46E5)';
    }
    notification.style.background = gradient;
    
    // Add internal styles
    const style = document.createElement('style');
    style.textContent = `
        .notification-content {
            display: flex;
            align-items: center;
            padding: 16px 20px;
            gap: 12px;
        }
        .notification-icon {
            font-size: 1.2rem;
            font-weight: bold;
            min-width: 20px;
        }
        .notification-message {
            flex: 1;
            font-size: 0.95rem;
            line-height: 1.4;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.3s ease;
        }
        .notification-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    `;
    
    if (!document.querySelector('#notification-styles')) {
        style.id = 'notification-styles';
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-remove after 6 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(450px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 400);
    }, 6000);
}

// Parallax Effect (Safe)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroCard = document.querySelector('.hero .profile-card');
    if (heroCard) {
        heroCard.style.transform = `translateY(${scrolled * 0.06}px)`;
    }
});

// Project Card Hover Effect with Tilt
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

// Add loading animation
window.addEventListener('load', () => {
    if (window.matchMedia('(max-width: 768px)').matches) {
        return;
    }
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <p>Loading amazing content...</p>
        </div>
    `;
    
    // Add loader styles
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .loader-content {
            text-align: center;
            color: white;
        }
        .loader-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .loader-content p {
            font-size: 1.1rem;
            font-weight: 500;
            opacity: 0.9;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(loader);
    
    // Remove loader after content loads
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
            style.remove();
        }, 500);
    }, 1500);
});

// Console welcome message
console.log('%c🚀 Welcome to my Portfolio!', 'font-size: 20px; font-weight: bold; color: #4F46E5;');
console.log('%cBuilt with HTML, CSS, and JavaScript', 'font-size: 14px; color: #10B981;');
console.log('%cFeel free to explore and connect!', 'font-size: 14px; color: #6B7280;');
